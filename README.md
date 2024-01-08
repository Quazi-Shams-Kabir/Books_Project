# Book Review



- Project to practice postgresql, some more api concepts and hmtl, css, js.  

- Functionalities :
    - CREATE or add new book entry and its details into <u>postgresql</u> DB.
    - READ and shows the stored book details and review it to the user beautifully, which are stored in the DB.
    - UPDATE review section on the webpage and save the updated data to DB.
    - DELETE book from DB.
    - Sort the books (ORDER BY of postgresql) according to user preference (alphabetic, recency, rating).
    - Uses <u>openlibrary search api</u> to search for books and details when adding book (after clicking on add new button).
    - Fetches cover edition key, book title, author name, first publish year for user when they click on a book from search result (they need to add some data manually after that).
    - Uses <u>openlibrary cover api</u> and cover edition key stored in DB to render the cover.
    - Buttons with direct link to buy or read pdf if user stored it into DB.

- npm i to install all node packages.
- node index.js to run on default port.
- default port is 3000.
- postgresql must run first before running the website.
- uncomment the localhost db client details, enter your own details of pg client and comment the deployment one.

P.S. If details are wrong it's openlibrary's fault not mine.