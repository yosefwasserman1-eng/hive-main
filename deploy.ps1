$PROJECT_ID = "your-project-id" # REPLACE THIS
$REGION = "me-west1" # REPLACE THIS (e.g., us-central1, me-west1 for Israel)
$SERVICE_NAME = "hive-app"
$REPO_NAME = "hive-repo" # Artifact Registry Repository Name

Write-Host "Starting deployment process..."

# 1. Enable services (first time only, can be commented out later)
Write-Host "Enabling necessary services..."
gcloud services enable run.googleapis.com artifactregistry.googleapis.com sqladmin.googleapis.com

# 2. Create Artifact Registry Repository (first time only)
# Write-Host "Creating Artifact Registry repository..."
# gcloud artifacts repositories create $REPO_NAME --repository-format=docker --location=$REGION --description="Docker repository for Hive app"

# 3. Build and Submit Image
Write-Host "Building and submitting image to Artifact Registry..."
# Note: This assumes the repo already exists. If not, uncomment step 2 or create it manually.
$IMAGE_URI = "$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$SERVICE_NAME"
gcloud builds submit --tag $IMAGE_URI .

# 4. Deploy to Cloud Run
Write-Host "Deploying to Cloud Run..."
# Note: You need to create the Cloud SQL instance first and get the connection name.
# Replace INSTANCE_CONNECTION_NAME with "project:region:instance"
$INSTANCE_CONNECTION_NAME = "your-project-id:region:instance-name" 
$DB_PASSWORD = "your-db-password"

gcloud run deploy $SERVICE_NAME `
  --image $IMAGE_URI `
  --platform managed `
  --region $REGION `
  --allow-unauthenticated `
  --add-cloudsql-instances $INSTANCE_CONNECTION_NAME `
  --set-env-vars "DB_HOST=localhost,DB_USER=root,DB_PASSWORD=$DB_PASSWORD,DB_NAME=hive,DB_SOCKET_PATH=/cloudsql/$INSTANCE_CONNECTION_NAME"

Write-Host "Deployment complete!"
