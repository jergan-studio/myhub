/************* GLOBAL VARIABLES *************/
let repos = JSON.parse(localStorage.getItem("repos")) || [];

/************* REPO LIST FUNCTIONS *************/
function createRepo() {
  const name = document.getElementById("repoName").value.trim();
  if (!name) return alert("Enter a repo name");

  // Generate a random deploy token
  const token = generateToken(16);

  repos.push({
    name,
    files: [{ path: "README.md", content: "# " + name }],
    deployToken: token,      // unique token per repo
    deployedURL: null        // will store the deploy URL
  });

  localStorage.setItem("repos", JSON.stringify(repos));
  document.getElementById("repoName").value = "";
  renderRepos();
}

/************* RENDER REPOS *************/
function renderRepos() {
  const list = document.getElementById("repoList");
  list.innerHTML = "";

  repos.forEach((repo, index) => {
    const li = document.createElement("li");

    // Repo name clickable
    const nameSpan = document.createElement("span");
    nameSpan.textContent = repo.name;
    nameSpan.style.cursor = "pointer";
    nameSpan.onclick = () => {
      localStorage.setItem("currentRepo", index);
      location.href = "repo.html";
    };
    li.appendChild(nameSpan);

    // Show deploy token
    const tokenSpan = document.createElement("span");
    tokenSpan.textContent = " | Token: " + repo.deployToken;
    tokenSpan.style.marginLeft = "10px";
    tokenSpan.style.fontSize = "0.8em";
    tokenSpan.style.color = "#888";
    li.appendChild(tokenSpan);

    // Deploy button
    const deployBtn = document.createElement("button");
    deployBtn.textContent = "Deploy";
    deployBtn.style.marginLeft = "10px";
    deployBtn.onclick = () => deployRepo(index);
    li.appendChild(deployBtn);

    // Show deployed URL if exists
    if (repo.deployedURL) {
      const urlLink = document.createElement("a");
      urlLink.href = repo.deployedURL;
      urlLink.textContent = "View Site";
      urlLink.target = "_blank";
      urlLink.style.marginLeft = "10px";
      li.appendChild(urlLink);
    }

    list.appendChild(li);
  });
}

/************* DEPLOY SIMULATION *************/
function deployRepo(index) {
  const repo = repos[index];
  const token = repo.deployToken;

  // Simulate deploy by generating a fake URL with token
  const deployURL = `https://${repo.name.toLowerCase()}.myhub.com/?token=${token}`;
  repo.deployedURL = deployURL;
  localStorage.setItem("repos", JSON.stringify(repos));
  alert(`Repo deployed! URL: ${deployURL}`);
  renderRepos();
}

/************* HELPER: RANDOM TOKEN *************/
function generateToken(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

/************* INITIALIZE *************/
renderRepos();
