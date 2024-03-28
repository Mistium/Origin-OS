onload = () => {changeTab(0)};

window.addEventListener('resize', function() {
  const activeTab = document.querySelector('.tab.active');
  const underline = document.querySelector('.underline');
  const tabRect = activeTab.getBoundingClientRect();
  underline.style.width = `${tabRect.width}px`;
  underline.style.transform = `translateX(${tabRect.left}px)`;
});

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
  const selectedTab = tabs[tabIndex];
  const tabRect = selectedTab.getBoundingClientRect();
  underline.style.width = `${tabRect.width}px`;
  underline.style.transform = `translateX(${tabRect.left}px)`;
}
