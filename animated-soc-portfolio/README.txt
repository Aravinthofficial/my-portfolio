ARAVINTH R — ANIMATED CYBERSECURITY PORTFOLIO
================================================

WHAT'S INCLUDED
- index.html                 Main scrolling portfolio website
- css/style.css              Responsive design, animations, dark/light themes
- js/script.js               Menu scrolling, section highlighting, modal actions,
                              project filters, typing effect, intro animation
- assets/Aravinth_R_Resume.pdf Your resume PDF; used by the Download Resume button
- assets/profile-placeholder.svg Portrait placeholder until you add your photo
- assets/portfolio-design-preview.png Visual design concept preview

OPEN THE WEBSITE ON YOUR COMPUTER
1. Extract this ZIP file.
2. Open the extracted animated-soc-portfolio folder.
3. Double-click index.html to open it in Chrome, Edge or Firefox.
4. On the first open, see the cybersecurity intro animation. Click Skip intro to skip.
5. Click any menu item (About, Skills, Projects, etc.) to smoothly scroll to that section.
   The current section is highlighted in the menu. On mobile, the menu collapses.

INTERACTIVE ACTIONS
- Menu links scroll to each section on this same page.
- The intro animation has a Skip intro button and also finishes automatically.
- The role line has a typing animation.
- Project category buttons filter the project cards.
- View project details opens a dialog with tasks and tools for each project.
- Download Resume downloads assets/Aravinth_R_Resume.pdf.
- The sun/moon icon switches dark/light appearance and remembers the choice in this browser.
- Email and Phone buttons use mailto: and tel: links.
- The floating up-arrow returns to the top.
- A reading progress bar and section reveal animations respond to scrolling.

ADD YOUR OWN PHOTO
1. Prepare a clear portrait image, preferably JPG or PNG.
2. Copy it into the assets folder and name it profile.jpg.
3. Open index.html in a text editor.
4. Find: src="assets/profile-placeholder.svg" id="profilePhoto"
5. Change it to: src="assets/profile.jpg" id="profilePhoto"
6. Save index.html and refresh the browser.
   Keep the image file inside assets so the relative path works on GitHub Pages.

PERSONALIZE YOUR PROFILE LINKS
In index.html, search for YOUR-USERNAME and YOUR-LINKEDIN. Replace these placeholders
with your actual GitHub username and LinkedIn profile URL. The current links are examples.
Update any content you wish to personalize before publication.

PUBLISH FOR FREE WITH GITHUB PAGES
1. Sign in at https://github.com and create a new PUBLIC repository.
2. For a user site, name the repository exactly: YOUR-USERNAME.github.io
3. Upload the CONTENTS of the animated-soc-portfolio folder, not the outer folder itself.
   The index.html file must be at the root of the repository.
4. Commit the uploaded files.
5. In the repository, open Settings > Pages.
6. Under Build and deployment, choose Deploy from a branch, select main and /(root), then Save.
7. After GitHub Pages completes deployment, open https://YOUR-USERNAME.github.io/
8. Replace YOUR-USERNAME with your actual GitHub username.

NOTES
- This is a static front-end portfolio; the contact email and phone links open the visitor's
  email or calling app. No backend is included.
- GitHub and LinkedIn URLs are placeholders until you update them.
- Profile image is a placeholder; add your own portrait using the instructions above.
- Project details are based on the information in the resume. Add public repositories or reports
  only when you have them available to share.
- The website uses optional Google Fonts; if offline, local fallback fonts are used.
