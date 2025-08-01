Agent Lead Distribution System - README
 Agent Lead Distribution System (MERN Stack)
 This application allows you to upload a CSV file and automatically distribute the leads among 5
 agents stored in MongoDB. Built using Node.js, Express, MongoDB, and Mongoose.
 Project Structure:
 ├── app.js
 ├── routes/
 │   ├── agentRoutes.js
 │   └── uploadRoutes.js
 ├── controllers/
 │   ├── agentController.js
 │   └── uploadController.js
 ├── models/
 │   ├── Agent.js
 │   └── List.js
 ├── utils/
 │   └── api.js
 ├── .env
 └── README.md
 Requirements:- Node.js v16+- MongoDB (local or Atlas)
 Installation:
 $ git clone <your-repo-url>
 $ cd <your-project-folder>
 $ npm install
 Environment Variables (.env):
 PORT=8080
Agent Lead Distribution System - README
 MONGO_URL=mongodb://127.0.0.1:27017/agent-system
 Run the Server:
 $ npm start
 Backend will be running at http://localhost:8080
 Add Sample Agents (via Postman):
 POST http://localhost:8080/agents/create
 Body (JSON):
 {
  "name": "Agent One",
  "email": "agent1@example.com"
 }
 Repeat to create 5 agents (required before uploading CSV).
 Upload CSV and Distribute Leads:
 POST http://localhost:8080/upload
 Body:
 file: CSV file with fields: FirstName, Phone, Notes
 Example CSV Format:
 FirstName,Phone,Notes
 Alice,1234567890,Interested
 Bob,2345678901,Callback
 Carol,3456789012,Not Interested
 Lead Distribution Logic:- Uploaded leads are divided equally among 5 agents.- If rows aren’t divisible, the first agents get 1 extra row each.- Leads are saved in 'List' collection linked via 'agentId'.
 Collections Used:
Agent Lead Distribution System - README
 1. Agent – stores agent data
 2. List – stores assigned leads per agent
 Future Improvements:- Add authentication- Create agent dashboard- Add email notifications- Handle re-uploads & history
 Support:
 For issues, contact [paramesha0002@gmail.com] or open a GitHub issue
