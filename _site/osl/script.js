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
  const selectedTab = tabIndex === 0 ? tabs[0] : tabs[tabIndex - 1];
  underline.style.width = `${selectedTab.offsetWidth}px`;
  underline.style.transform = `translateX(${selectedTab.offsetLeft}px)`;
}
