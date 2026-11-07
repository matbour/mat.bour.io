---
company: Mathrix
role: First developer, then vice-CTO and CTO
summary: A Swiss edtech startup teaching maths and science to French-speaking students.
stack: [PHP, Lumen, GraphQL, Angular, Stripe, Braintree, Kubernetes, GCP]
url: https://www.youtube.com/@Mathrix
repo: https://github.com/mathrix-education/railgun
year: 2017
until: 2020
---

Mathrix, [backed by Venture Kick](https://www.venturekick.ch/Mathrix), teaches through videos and exercises. Its YouTube channel has more than 580,000 subscribers. I made the first commit of its API on July 4, 2017, with OAuth 2 from day one, and pushed its last deploy in 2023. Across the company's 50 repositories, I wrote 5,100 of the 10,000 commits.

- **Payments:** Stripe subscriptions in 2017, then Braintree in 2018.
- **API:** a Lumen REST API, rewritten in 2020 as Railgun, a GraphQL API on Lighthouse.
- **Infrastructure:** from manual SSH deploys on a single server to Google Kubernetes Engine in 2019, then Kustomize overlays per environment, Prometheus, Sentry, and finally Cloud Run.
- **Shared tooling:** a PHP coding standard, a JWT library, Cloud Functions for image compression and database backups, and a [SonarQube GitHub Action](https://github.com/mathrix-education/sonar-scanner). One library I published along the way, [laravel-cache-fallback](https://packagist.org/packages/mathieu-bour/laravel-cache-fallback), has 44,000 downloads on Packagist.
- **A second product, Mathrix Drive:** I wrote most of its API (525 of 622 commits).
