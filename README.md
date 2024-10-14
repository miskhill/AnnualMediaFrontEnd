# AnnualMedia

AnnualMedia is a full stack app designed to help you remember the movies, series, and books that you have consumed. It includes a MongoDB database, a server built with Node.js and Express, and a frontend built with React.

Sure, you can add the following section to the README to provide information on where the app is hosted:

## Deployment

The app is currently deployed on [annualmedia.pages.dev](https://annualmedia.pages.dev/). You can access the live version of the app by visiting the website. Note that the live version may be running a different version of the code than the local version on your machine.

To deploy the app to your own hosting platform, follow these steps:

1. Build the frontend by navigating to the `client` folder and running `npm run build`.
2. Copy the build folder to your hosting platform.
3. Start the server on your hosting platform by navigating to the `server` folder and running `npm run serve`.
4. Configure your hosting platform to serve the `index.html` file in the build folder as the root file for your app.

## Installation

To install the app, follow these steps:

1. Clone the repository to your local machine.
2. Navigate to the `client` folder and run `npm install` to install the frontend dependencies.
3. Navigate to the `server` folder and run `npm install` to install the server dependencies.

## Usage

To use the app, follow these steps:

1. Start the server by navigating to the `server` folder and running `npm run serve`.
2. Start the frontend by navigating to the `client` folder and running `npm start`.
3. Open your browser and go to `http://localhost:3000` to use the app.

The app includes the following features:

- Upload and display a collection of movies, series, and books that you have consumed.
- Rate the movies, series, and books that you have consumed.
- Search and filter functionality to make it easy to find specific items in your collection.

## Dependencies

The app requires the following dependencies:

### Client

- @emotion/react: 11.10.6
- @emotion/styled: 11.10.6
- @mui/icons-material: 5.11.0
- @mui/material: 5.11.11
- @mui/styled-engine-sc: 5.11.0
- @shoelace-style/shoelace: 2.0.0
- @testing-library/jest-dom: 5.16.5
- @testing-library/react: 13.4.0
- @testing-library/user-event: 13.5.0
- axios: 1.2.2
- dotenv: 16.0.3
- react: 18.0.0
- react-dom: 18.2.0
- react-hook-form: 7.42.0
- react-router-dom: 6.6.1
- react-scripts: 4.0.3
- sonner: 0.3.0
- styled-components: 5.3.6

### Server

- bcrypt: 5.1.0
- body-parser: 1.20.1
- cors: 2.8.5
- dotenv: 16.0.3
- express: 4.18.2
- mongoose: 6.8.1
- nodemon: 2.0.20

## Contributing

Contributions to the app are welcome. To contribute, follow these steps:

1. Fork the repository on GitHub.
2. Clone the forked repository to your local machine.
3. Create a new branch for your changes.
4. Make your changes and commit them.
5. Push the changes to your forked repository.
6. Submit a pull request to the original repository.

## License

The app is released under the ISC license.

# Learns - before I forget
CRA uses React script v5 and MUI was not supporting this causing not found
Differences in React Router - uses Element rather than Component
In my controller I had named my fetch variable the same as the collection which needed re-naming! const movies to fetch movies. Wasn't too smart.

Used ClickUp for project management

[ClickUp](public/Screenshot%202023-01-21%20at%2011.23.12.png)

## Contact

If you have any questions or need support, you can contact the author at [insert email or social media here].
