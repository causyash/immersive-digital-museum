# Database Setup Steps (MongoDB Atlas)

## 1. Create a MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
2. Sign up or log in using your preferred method (Google, GitHub, etc.).

## 2. Deploy a Free Cluster
1. After logging in, click on **"Build a Database"** or **"Create a new cluster"**.
2. Select the **"M0 Free"** shared cluster option.
3. Choose your preferred cloud provider (AWS, Google Cloud, or Azure) and a region closest to your users.
4. Click **"Create Cluster"**. Wait a few minutes for the cluster to be provisioned.

## 3. Configure Security & Access
1. **Create a Database User**:
   - Navigate to **"Database Access"** under the Security tab on the left sidebar.
   - Click **"Add New Database User"**.
   - Set an authentication method to "Password" and choose a username (e.g., `admin`) and a strong password. **Make sure to save this password somewhere safe!**
   - Under Database User Privileges, ensure they have "Read and write to any database".
   - Click **"Add User"**.

2. **Allow Network Access (IP Whitelisting)**:
   - Navigate to **"Network Access"** under the Security tab.
   - Click **"Add IP Address"**.
   - For remote backend deployment (like Render) or local development, choose **"Allow Access from Anywhere"** (which adds `0.0.0.0/0`), or manually add your current IP address.
   - Click **"Confirm"**.

## 4. Get the Connection String
1. Go back to the **"Database"** section under the Deployment tab.
2. Click the **"Connect"** button next to your newly created cluster.
3. Choose **"Connect your application"** under drivers.
4. Copy the connection string. It will look something like this:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
5. Replace `<username>` and `<password>` with the credentials you created in Step 3. Replace `<password>` exactly, removing the angle brackets.

## 5. Add Connection String to the Server `.env` File
1. In the backend (`server`) code of the project, create a `.env` file.
2. Add your MongoDB URI as an environment variable:
   ```env
   MONGO_URI=mongodb+srv://admin:your_secure_password@cluster0.xxxxx.mongodb.net/museum?retryWrites=true&w=majority
   ```
   *(Note: Add `/museum` or your preferred database name before the `?` to automatically create that specific database instead of defaulting to `test`)*

## 6. (Optional) Browse Data with MongoDB Compass
1. You can download [MongoDB Compass](https://www.mongodb.com/try/download/compass) to view your data visually.
2. Paste the exact same connection string into Compass to connect, inspect, and manage collections like `Users`, `Artists`, `Artworks`, and `Exhibitions` once your API starts interacting with the DB.
