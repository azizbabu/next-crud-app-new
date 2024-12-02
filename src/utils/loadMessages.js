// // src/utils/loadMessages.js

// import fs from 'fs';
// import path from 'path';

// // Function to load and merge messages from root and page-specific folders
// const loadMessages = (locale, page) => {
//   // Path to the global messages folder in the root of the project
//   const rootMessagesPath = path.resolve(process.cwd(), 'messages'); // Global messages folder (outside of src)

//   // Path to page-specific messages in the `app` directory
//   const pageMessagesPath = path.resolve(process.cwd(), 'src', 'app', page, 'messages'); // Page-specific messages (inside src)
  
//   let messages = {};

//   // Load global messages if they exist
//   const rootMessagesFile = path.join(rootMessagesPath, `${locale}.json`);
//   if (fs.existsSync(rootMessagesFile)) {
//     messages = { ...messages, ...JSON.parse(fs.readFileSync(rootMessagesFile, 'utf-8')) };
//   }

//   // Load page-specific messages if they exist
//   const pageMessagesFile = path.join(pageMessagesPath, `${locale}.json`);
//   if (fs.existsSync(pageMessagesFile)) {
//     messages = { ...messages, ...JSON.parse(fs.readFileSync(pageMessagesFile, 'utf-8')) };
//   }

//   return messages;
// };

// export default loadMessages;

// src/utils/loadMessages.js

import fs from 'fs';
import path from 'path';

// Function to load and merge messages from multiple locations
const loadMessages = (locale) => {
  // Define the paths to the various message directories
  const messageDirs = [
    path.resolve(process.cwd(), 'messages'),
    path.resolve(process.cwd(), 'src', 'app', 'messages')
    // path.resolve(process.cwd(), 'src', 'app', 'app', 'messages'),
    // path.resolve(process.cwd(), 'src', 'app', 'app/profile', 'messages'),
    // path.resolve(process.cwd(), 'src', 'app/auth', 'messages')
  ];

  // Initialize an empty object to hold the merged messages
  let messages = {};

  // Loop through each directory and load its messages
  messageDirs.forEach((dir) => {
    const messagesFile = path.join(dir, `${locale}.json`);
    if (fs.existsSync(messagesFile)) {
      // If the messages file exists, merge the content into the messages object
      const fileMessages = JSON.parse(fs.readFileSync(messagesFile, 'utf-8'));
      messages = { ...messages, ...fileMessages };
    }
  });

  return messages;
};

export default loadMessages;

