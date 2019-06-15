<!-- @format -->

<p align="center">
    <img src="src/renderer/images/virgo-full.svg"><br/>
    Crowdsourced  fuzzing cluster. 🚀
<p>

<p align="center">
     <a href="https://travis-ci.org/mozillasecurity/virgo"><img src="https://img.shields.io/travis/mozillasecurity/virgo/master.svg?style=flat-square"/></a> <a href="https://github.com/MozillaSecurity/virgo/releases"><img src="https://img.shields.io/github/release/mozillasecurity/virgo.svg" alt="Current Release"></a> <a href="https://david-dm.org/mozillasecurity/virgo"><img src="https://img.shields.io/david/mozillasecurity/virgo.svg?style=flat-square"/></a> <a href="https://coveralls.io/github/MozillaSecurity/virgo?branch=master"><img src="https://coveralls.io/repos/github/MozillaSecurity/virgo/badge.svg?branch=master" alt="Coverage Status"></a>
</p>

## Overview

- [What is Virgo?](#🤔What-Is-Virgo?)
- [How does it work?](#💡How-Does-It-Work?)
- [Contributing](#Contributing)
- [Screenshots](#Screenshots)

## 🤔What is Virgo?

[Virgo](https://en.wikipedia.org/wiki/Virgo_Supercluster) is a concept for creating a cluster of fuzzers made by users who are willing to trade and contribute their CPU resources of their workstations to a greater good.

**Use Cases**

- Intracompany fuzz testing by using office workstations after-hours without additional spending on cloud providers.
- Software developers can point Virgo to their own Task Definition Server and quickly test among colleagues newly developed features.
- Bug bounty hunters and open source supporters creating a collective supercluster in testing features more quickly and more intensively, and potentially get rewarded for providing their CPU time.

Virgo can theoretically be used for any arbitrary work task defined in a container. However, Virgo was built as a fuzzing solution in mind.

## 💡How does it work?

Virgo's infrastructure is based on Docker. Virgo fetches routinely a remote server for new tasks by downloading a [Task Definition File](https://virgo-tasks.herokuapp.com/tasks) which contains information on how to run a task and which host preferences are required.
If the required hosts preferences meet the constraints for a certain task, Virgo will download the image, create a container and run that container until a user action intervenes or run "indefinitely". An intervention can be pause, stop, a scheduler, observed system or network activity. If a crash is found during a run, it immediately is sent to our backend for further analyzation and in case of a security issue, you will be informed by the provided contact email address.

## Contributing

### Launch Virgo

```
git clone https://github.com/mozillasecurity/virgo && cd virgo && npm -s install
npm start
```

> Developer extensions are enabled in non-production builds, except Devtron for analyzing IPC traffic. You can enable it by entering `require('devtron').install()` in the Developer Console.

To produce a production build run first `npm run build` and optionally `npm run release <platform>`. Where `platform` can be `macos64`, `windows64`, `linux64` or `''` to create a release for all platforms.

For a detailed list of commands run `npm run`

### Launch Task Definition Server

```
cd heroku && npm -s install && npm start
```

See [Wiki](https://github.com/MozillaSecurity/virgo/wiki) for detailed setup instructions including Minio for testing in-app updates, Sentry.io for in-app crashes and FuzzManager as custom crash collector backend.

## Screenshots

![Dashboard](resources/dashboard.png)
![Activity](resources/activity.png)
![Settings](resources/settings.png)

## Author

👤 **Christoph Diehl &lt;cdiehl@mozilla.com&gt;**

- Twitter: [@posidron](https://twitter.com/posidron)
- Github: [@posidron](https://github.com/posidron)
