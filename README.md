# Time Tracker App
A simple app to track your activities throughout the day

---

## Setup
- Create a Firebase App
- Setup Cloud Firestore
- Add a new web app and note down the credentials
- Create a new file `src/config/firebase-config.js` based on the template values from the provided sample file (`firebase-config-sample.js`) and update your credentials

## Running in local
```sh
# Install dependencies
yarn install # or npm i

# Starting the application
yarn start # or npm start
```

## TODO
[ ] Write unit tests
[ ] Migrate to TypeScript
[x] ~~Code cleanup~~
[ ] Support variable time interval (instead of existing 30 mins)
[ ] Switch between dark and light themes
[ ] Authentication
[ ] Adding labels/tags to activities
[ ] Visualizing the time spent based on tags