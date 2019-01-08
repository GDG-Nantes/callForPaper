
# Call For Paper

**WARNING** ⚠️ This repository is obsolete since 2016. Please have a look to the maintained fork [cfpio](https://github.com/cfpio/callForPapers) and the new CFP we used at GDG Nantes: [conference-hall](https://github.com/bpetetot/conference-hall) 💚

<img src="https://raw.githubusercontent.com/SII-Nantes/callForPaper/master/readme/screenshot.png" alt="alt text" width="100%">

## Features

 - Powered by App Engine
 - Spring Back-end
 - AngularJS Front-end
 - Google Spreadsheet
 - Datastore database
 - JWT Token
 - Localization (fr, en)
 - Material design

### User Panel

 - Google, Github OAuth authentification
 - Account register (with email confirmation)
 - Talks submission (with email confirmation)
 - Save/delete draft

### Admin Panel

 - Sort talks (by rate, date, track...)
 - Filter talks (by track, talker name, description...)
 - Rate talk
 - Comment talk

## Setup

*Change **127.0.0.1:8080** to your application domain for production*

### Obtaining OAuth Keys

<img src="http://images.google.com/intl/en_ALL/images/srpr/logo6w.png" width="150">

- Visit [Google Cloud Console](https://cloud.google.com/console/project)
- Click **CREATE PROJECT** button
- Enter *Project Name*, then click **CREATE**
- Then select *APIs & auth* from the sidebar and click on *Credentials* tab
- Click **CREATE NEW CLIENT ID** button
 - **Application Type**: Web Application
 - **Authorized Javascript origins**: *http://127.0.0.1:8080*
 - **Authorized redirect URI**: *http://127.0.0.1:8080*

**Note:** Make sure you have turned on **Contacts API**, **Google+ API** and **Drive API** in the *APIs* tab.

<hr>

<img src="https://www.cloudamqp.com/images/blog/github.png" height="70">

- Visit [Github developers settings](https://github.com/settings/developers)
- Click **REGISTER NEW APPLICATION** button
 - **Application name**: *Application name*
 - **Homepage URL**: *http://127.0.0.1:8080*
 - **Authorization callback URL**: *http://127.0.0.1:8080*

### Obtaining reCAPTCHA Keys

<img src="https://www.gstatic.com/recaptcha/admin/logo_recaptcha_color_24dp.png" height="70">

- Visit [reCaptcha panel](https://www.google.com/recaptcha/admin)
 - **Domaines**: *127.0.0.1:8080*
- Click **Save** button

### Edit CFP Settings


Edit `src/main/webapp/WEB-INF/appengine-web.xml` replace the informations to suit your need :

```xml
<?xml version="1.0" encoding="utf-8"?>
<appengine-web-app xmlns="http://appengine.google.com/ns/1.0">
    <application>yourAppID</application>
    <version>1</version>
    <threadsafe>true</threadsafe>
    <system-properties>
        <property name="java.util.logging.config.file" value="WEB-INF/logging.properties"/>
    </system-properties>
    <sessions-enabled>true</sessions-enabled>
    <env-variables>
        <env-var name="ENV" value="dev"/>
        <env-var name="GOOGLE_LOGIN" value="yourGoogleLogin"/> <!--owner's email of the spreadsheet (google drive account)-->
        <env-var name="GOOGLE_PASSWORD" value="yourGooglePassword" /> <!-- optional password for testing purpose, empty string otherwise-->
        <env-var name="GOOGLE_CLIENT_ID" value="yourGoogleClientId"/> <!--google oauth client id-->
        <env-var name="GOOGLE_CLIENT_SECRET" value="youtGoogleClientSecret"/> <!--google oauth secret-->
        <env-var name="GITHUB_CLIENT_ID" value="yourGithubClientId"/> <!--github oauth client id-->
        <env-var name="GITHUB_CLIENT_SECRET" value="youtGithubClientSecret"/> <!--github oauth client secret-->
        <env-var name="EMAIL_SENDER" value="yourEmailUsername"/> <!--sender's email address-->
        <env-var name="AUTH_SECRET_TOKEN" value="yourRandomSecretToken"/> <!--random secret token for jwt-->
        <env-var name="AUTH_CAPTCHA_PUBLIC" value="yourRecaptchaPublicToken"/> <!--recaptcha public key-->
        <env-var name="AUTH_CAPTCHA_SECRET" value="yourRecaptchaSecretToken"/> <!--recaptcha private key-->
    </env-variables>
</appengine-web-app>
```
Edit `src/main/webapp/WEB-INF/application-prod.properties` replace the informations to suit your need :

```properties
google.login=${GOOGLE_LOGIN}
google.password=${GOOGLE_PASSWORD}
google.spreadsheetName=CallForPaper // google spreadsheet name
google.worksheetName=prod // google worksheet name
google.clientid=${GOOGLE_CLIENT_ID}
google.clientsecret=${GOOGLE_CLIENT_SECRET}

github.clientid=${GITHUB_CLIENT_ID}
github.clientsecret=${GITHUB_CLIENT_SECRET}

auth.secrettoken=${AUTH_SECRET_TOKEN}
auth.captchapublic=${AUTH_CAPTCHA_PUBLIC}
auth.captchasecret=${AUTH_CAPTCHA_SECRET}  

database.loaded=true

email.emailsender=${EMAIL_SENDER}
email.send=true // disable emailing

webapp.dir=dist

app.eventName=DevFest 2015 // navbar title "Call for paper - {{eventName}}"
app.community=GDG Nantes // community name (for email)
app.date=06/11/2015 // event date
app.releasedate=01/09/2015 // speakers publication date
app.hostname=http://aesthetic-fx-89513.appspot.com // root domain (email images/links)
```
Edit `src/main/webapp/WEB-INF/static/app/scripts/app.js` add your providers tokens :

```javascript
  .constant('Config', {
    'recaptcha': 'yourRecaptchaPublicToken',
    'googleClientId': 'yourGoogleClientId',
    'githubClientId': 'yourGithubClientId'
  })
```

## Deployment :

### App Engine :

```shell
grunt build
mvn appengine:update [-Dmaven.test.skip=true]
```
 - Go to : http://YOUR_APP_ID.appspot.com


### Local :

```shell
grunt build
mvn appengine:devserver [-Dmaven.test.skip=true]
```
*For local deployment, set all `appengine-web.xml` env-var in you OS with the same value.*

 - Go to : http://127.0.0.1:8080

 - The application will guide you througth the process to link your Google Drive account to the application.

## Usage :

### Manage admin users :

- Visit [Google Cloud Console](https://cloud.google.com/console/project)
- Select your project
- Click **Permissions** button
- Click **Add member** button :
 - **Email**: New member e-mail
 - **Can view**

### App entry points :

 - http://127.0.0.1:8080/ : User login page (create new talks)

 - http://127.0.0.1:8080/#/config : Google Drive linking panel (autorize CFP to access your account to create the spreadsheet)

 - http://127.0.0.1:8080/#/admin : Admin panel (rating, comment...)

### Deployment

To use the powerful of AppEngine static engine, we divide the project into 2 _services_:
- backend: war and conf files
- default: static files resulting of `WEB-INF/static/dist` folder

Use the app.yaml in the root directory to upload the frontend service with the following commands:
```
grunt build
cp app.yaml src/main/webapp/WEB-INF/static/dist/
gcloud --project devfestnantes2015-cfp preview app deploy --version v1 --quiet src/main/webapp/WEB-INF/static/dist/app.yaml
```

Then, we have to configure the `src/main/webapp/WEB-INF/static/dist/dispatch.yaml` service to redirect the url to the good service:
```
dispatch:
  - url: "*/"
    module: default

  - url: "*/api/*"
    module: backend

  - url: "*/auth/*"
    module: backend

```
Use the upload command to activate the dispatch `appcfg.sh update dist/` or
`appcfg.py -A devfestnantes2015-cfp update_dispatch dist/`
