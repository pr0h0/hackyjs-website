let state = {};

function generateVideoCard(video) {
  const videoCard = document.createElement("div");
  videoCard.className = "video-card bg-white p-4 rounded-lg shadow-lg flex";

  const img = document.createElement("img");
  img.src = video.image;
  img.alt = `Video Thumbnail: ${video.title}`;
  img.className = "w-full h-48 object-cover rounded-t-lg";

  const content = document.createElement("div");
  content.className = "p-4 flex flex-col justify-between";

  const videoTitle = document.createElement("h3");
  videoTitle.className = "text-xl font-semibold mt-4";
  videoTitle.textContent = video.title;

  const videoDescription = document.createElement("p");
  videoDescription.className = "mt-2 text-gray-600";
  videoDescription.textContent = video.description;

  const tagsContainer = document.createElement("div");
  tagsContainer.className = "mt-2 flex flex-wrap";
  video.tags.forEach((tag) => {
    const tagSpan = document.createElement("span");
    tagSpan.className =
      "bg-yellow-400 text-gray-900 px-2 py-1 rounded mr-2 mb-2";
    tagSpan.textContent = tag;
    tagsContainer.appendChild(tagSpan);
  });

  const overlay = document.createElement("div");
  overlay.className =
    "overlay px-4 flex flex-wrap justify-center items-center content-center gap-4";
  overlay.innerHTML =
    '<p class="w-full block text-base font-semibold text-white text-center">Watch this Video on:</p>';
  video.urls.sort().forEach((url) => {
    const link = document.createElement("a");
    link.href = url.url;
    link.target = "_blank";
    link.className = "text-white";
    link.innerHTML = `<i class="${url.icon} fa-2x"></i>`;
    overlay.appendChild(link);
  });

  content.appendChild(videoTitle);
  content.appendChild(videoDescription);
  content.appendChild(tagsContainer);
  content.appendChild(overlay);
  videoCard.appendChild(img);
  videoCard.appendChild(content);

  return videoCard;
}

function generateSearchResults(event) {
  event.preventDefault();

  const searchInput = document.querySelector("input#search");
  const searchValue = searchInput.value.toLowerCase();
  const videoContainer = document.getElementById("video-container");

  videoContainer.innerHTML = "";
  const videos = state.videos.filter((video) => {
    if (
      video.title.toLowerCase().includes(searchValue) ||
      video.description.toLowerCase().includes(searchValue) ||
      video.tags.some((tag) => tag.toLowerCase().includes(searchValue))
    ) {
      return true;
    }
    return false;
  });

  videos.forEach((video) => {
    const videoCard = generateVideoCard(video);
    videoContainer.appendChild(videoCard);
  });

  if (!videos.length) {
    const noResults = document.createElement("p");
    noResults.className = "text-center text-2xl font-semibold text-gray-600";
    noResults.textContent = "No videos found";
    videoContainer.appendChild(noResults);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  fetch("/data.json")
    .then((response) => response.json())
    .then((data) => {
      if (window.location.pathname === "/")
        return {
          ...data,
          videos: data.videos.slice(-3),
        };
      return data;
    })
    .then((data) => {
      Object.assign(state, data);
      const videoContainer = document.getElementById("video-container");
      data.videos.reverse().forEach((video) => {
        const videoCard = generateVideoCard(video);
        videoContainer.appendChild(videoCard);
      });
    })
    .catch((error) => console.error("Error fetching video data:", error));

  const searchInput = document.querySelector("input#search");
  const searchForm = searchInput?.closest("form");

  searchForm?.addEventListener("submit", generateSearchResults);
  searchInput?.addEventListener("input", generateSearchResults);
});
