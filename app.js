let repos = JSON.parse(localStorage.getItem("repos")) || [];

function createRepo() {
  const name = document.getElementById("repoName").value.trim();
  if (!name) return;

  repos.push({
    name,
    files: [
      { path: "README.md", content: "# " + name }
    ]
  });

  localStorage.setItem("repos", JSON.stringify(repos));
  document.getElementById("repoName").value = "";
  renderRepos();
}

function renderRepos() {
  const list = document.getElementById("repoList");
  list.innerHTML = "";

  repos.forEach((repo, index) => {
    const li = document.createElement("li");
    li.textContent = repo.name;
    li.onclick = () => {
      localStorage.setItem("currentRepo", index);
      location.href = "repo.html";
    };
    list.appendChild(li);
  });
}

renderRepos();
