Step 1: Set Up the Next.js Project with TypeScript
Instructions:
Use the terminal to create a new Next.js project with TypeScript by running the official setup command and selecting TypeScript and the src/ directory option.

Update the tsconfig.json file to configure the import alias @/* to map to src/*.

Test:
Start the development server and confirm the default Next.js welcome page loads in the browser.

Create a simple component in src/components, import it into a page using the @/ alias (e.g., @/components/MyComponent), and verify it renders correctly.

Step 2: Integrate ESLint
Instructions:
Install ESLint along with plugins and configurations recommended for Next.js and TypeScript.

Create a .eslintrc.json file in the project root with rules tailored for TypeScript and Next.js.

Add a "lint": "eslint ." script to package.json.

Test:
Run the lint script and confirm no errors appear in the default project files.

Add an unused variable to a file, run the lint script again, and ensure ESLint flags it as an error.

Step 3: Set Up Tailwind CSS
Instructions:
Install Tailwind CSS and its dependencies following the official Next.js guide.

Generate a tailwind.config.js file and configure it to scan the src/ directory for content.

Create a global CSS file in src/styles and add the Tailwind directives (@tailwind base;, @tailwind components;, @tailwind utilities;).

Test:
Add a Tailwind class (e.g., text-blue-500) to an element on a page and confirm the style applies when viewing the page in the browser.

Step 4: Configure Firestore
Instructions:
Create a Firebase project via the Firebase Console and enable Firestore in the database section.

Install the Firebase SDK in the Next.js project using the package manager.

Create a src/lib/firebase.ts file to initialize Firebase and export the Firestore instance with your project’s configuration.

Test:
Write a temporary function in a page to fetch a test document from Firestore and log it to the console. Verify the data appears when the page loads.

Step 5: Implement Authentication
Instructions:
Enable Firebase Authentication in the Firebase Console with email/password as the provider.

Create sign-up and sign-in pages under src/app (e.g., src/app/signup/page.tsx and src/app/signin/page.tsx) with forms including a username field.

Add logic to check Firestore for username uniqueness during sign-up and store user data (including username) in Firestore upon successful registration.

Test:
Sign up with a new email and username, then check Firebase Auth and Firestore to confirm the user and username are stored.

Try signing up with the same username again and verify the process fails with an appropriate error message.

Step 6: Create Project Management Features
Instructions:
Define a Firestore schema: a users collection with a subcollection projects for each user, where each project document includes fields like name, isPublic, and optional fields (details, estimatedTime, availableTime, timeline, archived, archiveReason).

Build a project creation page (e.g., src/app/projects/new/page.tsx) with a form to input project details and a public/private toggle.

Save new projects to Firestore under the authenticated user’s projects subcollection.

Test:
Log in, create a project, and verify it appears in the user’s Firestore projects subcollection with correct details.

Toggle the public setting, save, and confirm the change updates in Firestore.

Step 7: Implement Project Pages
Instructions:
Use Next.js App Router to create a dynamic route at src/app/[username]/[projectname]/page.tsx.

Fetch project data from Firestore using the username and projectname from the URL parameters.

Display project details on the page, restricting access to private projects unless the viewer is the owner.

Test:
Create a project, navigate to its URL (e.g., /john/myproject), and confirm the correct details display.

Log out, visit a private project URL, and ensure access is denied or redirected.

Step 8: Add Log Entry Functionality
Instructions:
Add a logEntries subcollection to each project document in Firestore with fields: date, plan, results, and blocks (an array of objects with tag and color).

Create a form on the project page to add log entries, including a tag input with predefined color-coded categories (e.g., bug: red, feature: blue).

Save new log entries to the project’s logEntries subcollection in Firestore.

Test:
Add a log entry with a plan, results, and a colored tag (e.g., bug: red), then verify it appears on the project page with the correct data and tag color.

Reload the page and ensure the log entry persists.

Step 9: Implement Archiving Projects
Instructions:
Add an archive button to the project page that sets the archived field to true and prompts for an archiveReason.

Update the project page to visually indicate archived status (e.g., grayed out) and display the reason.

Test:
Archive a project with a reason, then confirm the archived and archiveReason fields update in Firestore.

Reload the project page and verify the archived status and reason are displayed.

Step 10: Enhance User Experience
Instructions:
Use Tailwind CSS to ensure the app is responsive across mobile, tablet, and desktop screens.

Add loading indicators (e.g., spinners) and error messages for Firestore fetch operations.

Polish the UI for clarity (e.g., consistent button styles, form layouts).

Test:
Resize the browser or use device emulation to confirm the layout adapts correctly.

Disconnect the network, attempt a Firestore operation, and verify an error message appears with a loading state.

Step 11: Final Testing and Deployment
Instructions:
Test all features end-to-end: sign-up, project creation, log entries, archiving, and public/private toggling.

Resolve any bugs or usability issues identified during testing.

Deploy the app to a hosting platform like Vercel using their CLI or Git integration.

Test:
Access the deployed app online and verify all features work as expected.

Confirm the URL structure (e.g., /username/projectname) resolves correctly in production.

