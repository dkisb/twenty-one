# huszonegy

<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/dkisb/twenty-one">
    <img src="public/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Twenty-One (21) - The Card Game</h3>

  <p align="center">
    A modern web implementation of the classic Hungarian 21 card game.<br>
    Play, bet, and challenge the dealer in your browser!
    <br />
    <a href="https://github.com/dkisb/twenty-one"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/dkisb/twenty-one">View Demo</a>
    &middot;
    <a href="https://github.com/dkisb/twenty-one/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/dkisb/twenty-one/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Game Screenshot][product-screenshot]](https://github.com/dkisb/twenty-one)

Twenty-One (21) is a modern web version of the classic Hungarian card game. It supports betting, player stats, and a sleek animated UI. Play against the dealer, try to reach 21, and see how many games you can win!

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [![React][React.js]][React-url]
- [Vite][Vite-url]
- [Java Spring Boot][Spring-url]
- [PostgreSQL][Postgres-url]
- [Tailwind CSS][Tailwind-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

These instructions will get you a copy of the project up and running locally. For a live demo, see the hosted version (if available).

### Prerequisites

- [Java 17+](https://adoptopenjdk.net/)
- [Maven](https://maven.apache.org/) or [Gradle](https://gradle.org/)
- [Node.js](https://nodejs.org/) (for frontend, v18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/)

### Installation

1. **Clone the repo**
   ```sh
   git clone https://github.com/dkisb/twenty-one.git
   cd twenty-one
   ```
2. **Install frontend dependencies**
   ```sh
   cd frontend
   npm install
   ```
3. **Set up backend**
   ```sh
   cd ../backend
   # If you use Maven:
   mvn clean install
   # If you use Gradle:
   # gradle build
   ```
4. **Configure environment variables**

   - Copy `.env.example` to `.env` in `/backend` and fill in your PostgreSQL credentials and other necessary settings.
   - Set up your PostgreSQL database and user.

5. **Start PostgreSQL**

   - Make sure your PostgreSQL server is running and the database is created.

6. **Run the backend server**
   ```sh
   # If using Maven:
   mvn spring-boot:run
   # If using Gradle:
   # gradle bootRun
   ```
7. **Run the frontend development server (in another terminal)**
   ```sh
   cd frontend
   npm run dev
   ```
8. **Open [http://localhost:5173](http://localhost:5173) to view the game in your browser.**

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

- Click **Let's play** to start a game.
- Place your bet, draw cards, and try to beat the dealer by getting as close as possible to 21!
- View your stats and history in your account.

_For more details, see the [Documentation](https://github.com/dkisb/twenty-one/wiki)._

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- [ ] Multiplayer mode
- [ ] Mobile UI improvements
- [ ] Game history & leaderboards
- [ ] Internationalization
- [ ] More card games

See the [open issues](https://github.com/dkisb/twenty-one/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request, or simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Top contributors:

<a href="https://github.com/dkisb/twenty-one/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=dkisb/twenty-one" alt="contrib.rocks image" />
</a>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Dániel Kiss - [@dkisb](https://github.com/dkisb)

Project Link: [https://github.com/dkisb/twenty-one](https://github.com/dkisb/twenty-one)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

- [othneildrew/Best-README-Template](https://github.com/othneildrew/Best-README-Template)
- [React](https://reactjs.org/)
- [Java Spring](https://spring.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [contrib.rocks](https://contrib.rocks)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->

[contributors-shield]: https://img.shields.io/github/contributors/dkisb/twenty-one.svg?style=for-the-badge
[contributors-url]: https://github.com/dkisb/twenty-one/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/dkisb/twenty-one.svg?style=for-the-badge
[forks-url]: https://github.com/dkisb/twenty-one/network/members
[stars-shield]: https://img.shields.io/github/stars/dkisb/twenty-one.svg?style=for-the-badge
[stars-url]: https://github.com/dkisb/twenty-one/stargazers
[issues-shield]: https://img.shields.io/github/issues/dkisb/twenty-one.svg?style=for-the-badge
[issues-url]: https://github.com/dkisb/twenty-one/issues
[license-shield]: https://img.shields.io/github/license/dkisb/twenty-one.svg?style=for-the-badge
[license-url]: https://github.com/dkisb/twenty-one/blob/main/LICENSE
[product-screenshot]: public/screenshot.png
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vite-url]: https://vitejs.dev/
[Spring-url]: https://spring.io/projects/spring-boot
[Postgres-url]: https://www.postgresql.org/
[Tailwind-url]: https://tailwindcss.com/
