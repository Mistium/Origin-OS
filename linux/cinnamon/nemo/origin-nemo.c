/* Native GTK layout adapter for Nemo 6.x. File operations remain Nemo's. */
#include <gtk/gtk.h>
#include <gmodule.h>
#include <string.h>

typedef struct {
    GtkWindow *window;
    GtkNotebook *notebook;
    GtkWidget *tabs;
    gboolean updating;
    gboolean destroying;
} OriginWindow;

static GtkWidget *find_type(GtkWidget *widget, const char *type) {
    if (strcmp(G_OBJECT_TYPE_NAME(widget), type) == 0) return widget;
    if (!GTK_IS_CONTAINER(widget)) return NULL;
    GList *children = gtk_container_get_children(GTK_CONTAINER(widget));
    GtkWidget *found = NULL;
    for (GList *item = children; item && !found; item = item->next)
        found = find_type(GTK_WIDGET(item->data), type);
    g_list_free(children);
    return found;
}

static void add_class(GtkWidget *widget, const char *name) {
    gtk_style_context_add_class(gtk_widget_get_style_context(widget), name);
}

static void move_to_box(GtkWidget *widget, GtkWidget *box, gboolean expand) {
    GtkWidget *parent = gtk_widget_get_parent(widget);
    g_object_ref(widget);
    if (parent) gtk_container_remove(GTK_CONTAINER(parent), widget);
    gtk_box_pack_start(GTK_BOX(box), widget, expand, expand, 0);
    g_object_unref(widget);
}

static void select_tab(GtkButton *button, gpointer data) {
    OriginWindow *origin = data;
    GtkWidget *page = g_object_get_data(G_OBJECT(button), "origin-page");
    gint index = gtk_notebook_page_num(origin->notebook, page);
    if (index == gtk_notebook_get_current_page(origin->notebook)) gtk_toggle_button_set_active(GTK_TOGGLE_BUTTON(button), TRUE);
    else if (index >= 0) gtk_notebook_set_current_page(origin->notebook, index);
}

static void update_tabs(OriginWindow *origin) {
    if (origin->updating || origin->destroying) return;
    origin->updating = TRUE;
    GList *children = gtk_container_get_children(GTK_CONTAINER(origin->tabs));
    for (GList *item = children; item; item = item->next) gtk_widget_destroy(item->data);
    g_list_free(children);
    gint current = gtk_notebook_get_current_page(origin->notebook);
    for (gint i = 0; i < gtk_notebook_get_n_pages(origin->notebook); i++) {
        GtkWidget *page = gtk_notebook_get_nth_page(origin->notebook, i);
        GtkWidget *native = gtk_notebook_get_tab_label(origin->notebook, page);
        GtkWidget *label = native ? find_type(native, "GtkLabel") : NULL;
        const char *title = label ? gtk_label_get_text(GTK_LABEL(label)) : "Files";
        GtkWidget *button = gtk_toggle_button_new_with_label(title);
        GtkWidget *button_label = gtk_bin_get_child(GTK_BIN(button));
        gtk_label_set_ellipsize(GTK_LABEL(button_label), PANGO_ELLIPSIZE_END);
        gtk_widget_set_size_request(button, 180, -1);
        add_class(button, "origin-file-tab");
        gtk_toggle_button_set_active(GTK_TOGGLE_BUTTON(button), i == current);
        if (label) g_object_bind_property(label, "label", button, "label", G_BINDING_SYNC_CREATE);
        g_object_set_data(G_OBJECT(button), "origin-page", page);
        g_signal_connect(button, "clicked", G_CALLBACK(select_tab), origin);
        gtk_box_pack_start(GTK_BOX(origin->tabs), button, FALSE, FALSE, 0);
    }
    gtk_widget_show_all(origin->tabs);
    origin->updating = FALSE;
}

static void pages_changed(GtkNotebook *book, GtkWidget *page, guint index, gpointer data) {
    (void)book; (void)page; (void)index;
    update_tabs(data);
}

static void hide_native_tabs(GObject *book, GParamSpec *spec, gpointer data) {
    (void)spec; (void)data;
    if (gtk_notebook_get_show_tabs(GTK_NOTEBOOK(book))) gtk_notebook_set_show_tabs(GTK_NOTEBOOK(book), FALSE);
}

static void new_tab(GtkButton *button, gpointer data) {
    (void)button;
    gtk_accel_groups_activate(G_OBJECT(data), GDK_KEY_t, GDK_CONTROL_MASK);
}

static void maximize_window(GtkButton *button, gpointer data) {
    (void)button;
    GtkWindow *window = data;
    if (gtk_window_is_maximized(window)) gtk_window_unmaximize(window);
    else gtk_window_maximize(window);
}

static void minimize_window(GtkButton *button, gpointer data) {
    (void)button;
    gtk_window_iconify(GTK_WINDOW(data));
}

static void close_window(GtkButton *button, gpointer data) {
    (void)button;
    gtk_window_close(GTK_WINDOW(data));
}

static gboolean drag_window(GtkWidget *widget, GdkEventButton *event, gpointer data) {
    GtkWidget *target = gtk_get_event_widget((GdkEvent *)event);
    for (GtkWidget *p = target; p && p != widget; p = gtk_widget_get_parent(p))
        if (GTK_IS_BUTTON(p) || GTK_IS_SCROLLBAR(p)) return FALSE;
    if (event->button != 1) return FALSE;
    if (event->type == GDK_2BUTTON_PRESS) maximize_window(NULL, data);
    else if (event->type == GDK_BUTTON_PRESS)
        gtk_window_begin_move_drag(GTK_WINDOW(data), 1, event->x_root, event->y_root, event->time);
    return TRUE;
}

static GtkWidget *control(const char *icon, const char *tip, GCallback action, GtkWindow *window) {
    GtkWidget *button = gtk_button_new_from_icon_name(icon, GTK_ICON_SIZE_MENU);
    add_class(button, "origin-window-button");
    gtk_widget_set_tooltip_text(button, tip);
    g_signal_connect(button, "clicked", action, window);
    return button;
}

static GtkWidget *make_header(OriginWindow *origin) {
    GtkWidget *event = gtk_event_box_new();
    add_class(event, "origin-file-header");
    GtkWidget *box = gtk_box_new(GTK_ORIENTATION_HORIZONTAL, 0);
    gtk_container_add(GTK_CONTAINER(event), box);
    GtkWidget *scroll = gtk_scrolled_window_new(NULL, NULL);
    gtk_scrolled_window_set_policy(GTK_SCROLLED_WINDOW(scroll), GTK_POLICY_AUTOMATIC, GTK_POLICY_NEVER);
    gtk_scrolled_window_set_overlay_scrolling(GTK_SCROLLED_WINDOW(scroll), TRUE);
    gtk_scrolled_window_set_propagate_natural_width(GTK_SCROLLED_WINDOW(scroll), TRUE);
    gtk_scrolled_window_set_max_content_width(GTK_SCROLLED_WINDOW(scroll), 600);
    origin->tabs = gtk_box_new(GTK_ORIENTATION_HORIZONTAL, 4);
    gtk_container_add(GTK_CONTAINER(scroll), origin->tabs);
    gtk_box_pack_start(GTK_BOX(box), scroll, FALSE, FALSE, 0);
    GtkWidget *plus = gtk_button_new_from_icon_name("list-add-symbolic", GTK_ICON_SIZE_MENU);
    add_class(plus, "origin-new-tab");
    gtk_widget_set_tooltip_text(plus, "New tab");
    g_signal_connect(plus, "clicked", G_CALLBACK(new_tab), origin->window);
    gtk_box_pack_start(GTK_BOX(box), plus, FALSE, FALSE, 0);
    GtkWidget *spacer = gtk_event_box_new();
    gtk_widget_set_size_request(spacer, 30, -1);
    gtk_box_pack_start(GTK_BOX(box), spacer, TRUE, TRUE, 0);
    GtkWidget *buttons = gtk_box_new(GTK_ORIENTATION_HORIZONTAL, 0);
    add_class(buttons, "origin-window-buttons");
    gtk_box_pack_start(GTK_BOX(buttons), control("window-maximize-symbolic", "Maximize or restore", G_CALLBACK(maximize_window), origin->window), FALSE, FALSE, 0);
    gtk_box_pack_start(GTK_BOX(buttons), control("window-minimize-symbolic", "Minimize", G_CALLBACK(minimize_window), origin->window), FALSE, FALSE, 0);
    gtk_box_pack_start(GTK_BOX(buttons), control("window-close-symbolic", "Close", G_CALLBACK(close_window), origin->window), FALSE, FALSE, 0);
    gtk_box_pack_end(GTK_BOX(box), buttons, FALSE, FALSE, 0);
    gtk_widget_add_events(event, GDK_BUTTON_PRESS_MASK);
    g_signal_connect(event, "button-press-event", G_CALLBACK(drag_window), origin->window);
    return event;
}

static void set_text_fonts(GtkWidget *widget) {
    if (GTK_IS_TREE_VIEW(widget)) {
        GList *columns = gtk_tree_view_get_columns(GTK_TREE_VIEW(widget));
        for (GList *c = columns; c; c = c->next) {
            GList *cells = gtk_cell_layout_get_cells(GTK_CELL_LAYOUT(c->data));
            for (GList *cell = cells; cell; cell = cell->next)
                if (GTK_IS_CELL_RENDERER_TEXT(cell->data)) g_object_set(cell->data, "font", "monospace 10", NULL);
            g_list_free(cells);
        }
        g_list_free(columns);
    }
    if (GTK_IS_CONTAINER(widget)) {
        GList *children = gtk_container_get_children(GTK_CONTAINER(widget));
        for (GList *c = children; c; c = c->next) set_text_fonts(c->data);
        g_list_free(children);
    }
}

static void window_destroyed(GtkWidget *window, gpointer data) {
    (void)window;
    OriginWindow *origin = data;
    origin->destroying = TRUE;
    g_signal_handlers_disconnect_by_data(origin->notebook, origin);
}

static gboolean apply_window(gpointer data) {
    GtkWidget *window = data;
    if (gtk_widget_in_destruction(window) || g_object_get_data(G_OBJECT(window), "origin-layout")) return G_SOURCE_REMOVE;
    GtkWidget *grid = gtk_bin_get_child(GTK_BIN(window));
    GtkWidget *base = NULL, *toolbar = NULL, *status = NULL, *separator = NULL;
    if (!GTK_IS_GRID(grid)) return G_SOURCE_REMOVE;
    GList *children = gtk_container_get_children(GTK_CONTAINER(grid));
    for (GList *c = children; c; c = c->next) {
        GtkWidget *child = c->data;
        if (GTK_IS_PANED(child)) base = child;
        else if (GTK_IS_BOX(child) && find_type(child, "NemoToolbar")) toolbar = child;
        else if (find_type(child, "NemoStatusBar")) status = child;
        else if (GTK_IS_SEPARATOR(child)) separator = child;
    }
    g_list_free(children);
    if (!base || !toolbar || !status) {
        g_warning("originOS: unfamiliar Nemo layout; keeping the standard native layout");
        return G_SOURCE_REMOVE;
    }
    GtkWidget *right = gtk_paned_get_child2(GTK_PANED(base));
    GtkWidget *sidebar = gtk_paned_get_child1(GTK_PANED(base));
    GtkWidget *notebook = find_type(right, "NemoNotebook");
    if (!GTK_IS_BOX(right) || !notebook || !sidebar) return G_SOURCE_REMOVE;
    OriginWindow *origin = g_new0(OriginWindow, 1);
    origin->window = GTK_WINDOW(window);
    origin->notebook = GTK_NOTEBOOK(notebook);
    g_object_set_data_full(G_OBJECT(window), "origin-layout", origin, g_free);
    g_signal_connect(window, "destroy", G_CALLBACK(window_destroyed), origin);

    gint x, y, width, height;
    gtk_window_get_position(origin->window, &x, &y);
    gtk_window_get_size(origin->window, &width, &height);
    gtk_widget_hide(window);
    gtk_widget_unrealize(window);
    GtkWidget *empty = gtk_box_new(GTK_ORIENTATION_HORIZONTAL, 0);
    add_class(empty, "origin-empty-titlebar");
    gtk_widget_show(empty);
    gtk_window_set_titlebar(origin->window, empty);
    GdkVisual *rgba = gdk_screen_get_rgba_visual(gtk_widget_get_screen(window));
    if (rgba) gtk_widget_set_visual(window, rgba);
    add_class(window, "origin-files-window");
    add_class(sidebar, "origin-sidebar-shell");
    add_class(toolbar, "origin-toolbar-holder");
    add_class(status, "origin-status-holder");
    add_class(grid, "origin-file-root");
    add_class(right, "origin-file-content");
    GtkWidget *pathbar = find_type(toolbar, "NemoPathBar");
    if (pathbar) add_class(pathbar, "origin-file-pathbar");
    move_to_box(toolbar, right, FALSE);
    gtk_box_reorder_child(GTK_BOX(right), toolbar, 0);
    GtkWidget *header = make_header(origin);
    gtk_box_pack_start(GTK_BOX(right), header, FALSE, FALSE, 0);
    gtk_box_reorder_child(GTK_BOX(right), header, 0);
    gtk_widget_show_all(header);
    if (separator) move_to_box(separator, right, FALSE);
    move_to_box(status, right, FALSE);
    gtk_paned_set_position(GTK_PANED(base), 212);
    gtk_notebook_set_show_tabs(origin->notebook, FALSE);
    g_signal_connect(origin->notebook, "notify::show-tabs", G_CALLBACK(hide_native_tabs), NULL);
    g_signal_connect_after(origin->notebook, "switch-page", G_CALLBACK(pages_changed), origin);
    g_signal_connect_after(origin->notebook, "page-added", G_CALLBACK(pages_changed), origin);
    g_signal_connect_after(origin->notebook, "page-removed", G_CALLBACK(pages_changed), origin);
    g_signal_connect_after(origin->notebook, "page-reordered", G_CALLBACK(pages_changed), origin);
    update_tabs(origin);
    set_text_fonts(window);
    gtk_window_resize(origin->window, width, height);
    gtk_window_move(origin->window, x, y);
    gtk_widget_show(window);
    return G_SOURCE_REMOVE;
}

static gboolean apply_fonts(gpointer data) {
    GtkWidget *view = data;
    if (!gtk_widget_in_destruction(view)) set_text_fonts(view);
    return G_SOURCE_REMOVE;
}

static gboolean on_widget_map(GSignalInvocationHint *hint, guint count, const GValue *values, gpointer data) {
    (void)hint; (void)count; (void)data;
    GtkWidget *widget = g_value_get_object(&values[0]);
    if (strcmp(G_OBJECT_TYPE_NAME(widget), "NemoWindow") == 0)
        g_idle_add_full(G_PRIORITY_DEFAULT_IDLE, apply_window, g_object_ref(widget), g_object_unref);
    else if (GTK_IS_TREE_VIEW(widget))
        g_idle_add_full(G_PRIORITY_DEFAULT_IDLE, apply_fonts, g_object_ref(widget), g_object_unref);
    return TRUE;
}

G_MODULE_EXPORT void gtk_module_init(gint *argc, gchar ***argv) {
    (void)argc; (void)argv;
    gpointer widget_class = g_type_class_ref(GTK_TYPE_WIDGET);
    g_signal_add_emission_hook(g_signal_lookup("map", GTK_TYPE_WIDGET), 0, on_widget_map, NULL, NULL);
    g_type_class_unref(widget_class);
}
