/************* GLOBAL VARIABLES *************/
let repos = JSON.parse(localStorage.getItem("repos")) || [];

/************* REPO CREATION *************/
function createRepo() {
  const name = document.getElementById("repoName").value.trim();
  if (!name) return alert("Enter a repository name");

  const token = generateToken(16); // optional MyHub token

  repos.push({
    name,
    files: [{ path: "README.md", content: "# " + name }],
    deployToken: token,
    deployedURL: null
  });

  localStorage.setItem("repos", JSON.stringify(repos));
  document.getElementById("repoName").value = "";
  renderRepos();
}

/************* RENDER REPO LIST *************/
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

    // Optional token display
    const tokenSpan = document.createElement("span");
    tokenSpan.textContent = " | Token: " + repo.deployToken;
    tokenSpan.style.marginLeft = "10px";
    tokenSpan.style.fontSize = "0.8em";
    tokenSpan.style.color = "#888";
    li.appendChild(tokenSpan);

    // Deploy button
    const deployBtn = document.createElement("button");
    deployBtn.textContent = "Deploy to Vercel";
    deployBtn.style.marginLeft = "10px";
    deployBtn.onclick = () => deployToVercel(index);
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

/************* DEPLOY TO VERCEL *************/
async function deployToVercel(index) {
  const repo = repos[index];

  // Prompt user for personal token
  const userToken = prompt("Enter your Vercel Personal Token:");
  if (!userToken) return alert("Deployment cancelled: token required");

  // Prepare files for Vercel API
  const files = repo.files.map(f => ({
    file: f.path,
    data: f.content
  }));

  try {
    const res = await fetch("https://api.vercel.com/v13/deployments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: repo.name,
        files
      })
    });

    const data = await res.json();

    // Proper error handling
    if (data.error) {
      alert("Deployment failed:\n" + data.error.message);
      return;
    }

    if (data.url) {
      repo.deployedURL = "https://" + data.url;
      localStorage.setItem("repos", JSON.stringify(repos));
      alert("Deployed successfully! URL: " + repo.deployedURL);
      renderRepos();
    } else {
      alert("Unexpected response from Vercel:\n" + JSON.stringify(data));
    }

  } catch (err) {
    alert("Deployment error: " + err.message);
  }
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
