onload = () => {changeTab(0)};

function changeTab(tabIndex) {
  const tabs = document.querySelectorAll('.tab');
  const underline = document.querySelector('.underline');
  const tabContents = document.querySelectorAll('.tab-content');

  // Hide all tab contents
  tabContents.forEach(content => content.classList.remove('active'));

  // Show the selected tab content or all contents if the "All" tab is pressed
  if (tabIndex === 0) {
    tabContents.forEach(content => content.classList.add('active'));
  } else {
    document.getElementById(`tabContent${tabIndex}`).classList.add('active');
  }

  // Move the underline to the selected tab or "All" tab
  const selectedTab = tabs[tabIndex]; // No need to subtract 1
  const tabRect = selectedTab.getBoundingClientRect(); // Get bounding rectangle of the tab
  underline.style.width = `${tabRect.width}px`; // Set width to tab's width
  underline.style.transform = `translateX(${tabRect.left}px)`; // Set position to tab's left offset
}
