import fetch from "node-fetch";
import { execSync } from "child_process";
import dotenv from "dotenv";

dotenv.config();

const {
  RAILWAY_TOKEN,
  RAILWAY_PROJECT_ID,
  MYHUB_TOKEN,
  MYHUB_PROJECT_NAME,
  IMPLY_PROJECT_NAME,
  PREVIEW
} = process.env;

// ------------------------
// Deploy Imply Project
// ------------------------
async function deployImply() {
  console.log(`Deploying ${IMPLY_PROJECT_NAME}...`);

  if (PREVIEW === 'true') {
    const mockURL = `https://${IMPLY_PROJECT_NAME}.myhub.vercel.app`;
    console.log(`[Preview] Deployment URL: ${mockURL}`);
    return mockURL;
  }

  // Real Railway deployment
  execSync(`railway login --token ${RAILWAY_TOKEN}`, { stdio: 'inherit' });
  execSync(`railway up --project ${RAILWAY_PROJECT_ID}`, { stdio: 'inherit' });

  // Get Railway URL
  const statusOutput = execSync(`railway status --project ${RAILWAY_PROJECT_ID}`).toString();
  const urlMatch = statusOutput.match(/https:\/\/[^\s]+\.railway\.app/);
  if (!urlMatch) throw new Error("Could not find Railway URL!");
  const deploymentURL = urlMatch[0];
  console.log("Deployment URL:", deploymentURL);
  return deploymentURL;
}

// ------------------------
// Update MyHUB
// ------------------------
async function updateMyHub(deploymentURL) {
  console.log(`Updating ${MYHUB_PROJECT_NAME}...`);

  if (PREVIEW === 'true') {
    console.log(`[Preview] MyHUB would be updated with: ${deploymentURL}`);
    return;
  }

  const response = await fetch(`https://api.myhub.com/projects/${MYHUB_PROJECT_NAME}`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${MYHUB_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ url: deploymentURL })
  });

  const data = await response.json();
  console.log("MyHUB updated:", data);
}

// ------------------------
// Main
// ------------------------
async function main() {
  try {
    const deploymentURL = await deployImply();
    await updateMyHub(deploymentURL);
    console.log("Deployment complete!");
  } catch (err) {
    console.error("Deployment failed:", err);
  }
}

main();
