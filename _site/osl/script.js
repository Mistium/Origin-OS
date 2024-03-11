onload = () => {changeTab(1)};


function changeTab(tabIndex) {
  const tabs = document.querySelectorAll('.tab');
  const underline = document.querySelector('.underline');
  const tabContents = document.querySelectorAll('.tab-content');

  // Hide all tab contents
  tabContents.forEach(content => content.classList.remove('active'));

  // Show the selected tab content
  document.getElementById(`tabContent${tabIndex}`).classList.add('active');

  // Move the underline to the selected tab
  const selectedTab = tabs[tabIndex - 1];
  underline.style.width = `${selectedTab.offsetWidth}px`;
  underline.style.transform = `translateX(${selectedTab.offsetLeft}px)`;
}
