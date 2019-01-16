# Microsoft Excel integration for Arm Pelion
This project demonstrates how to create a Microsoft Excel add-in to observe live resources in the
Arm Pelion environment.

![Integration Example](/assets/example.png)

## Install
Clone this repository in a local folder using `git clone` or download and unpack the source code.

Rebuild the dependencies, with `npm`:

```
npm install
```

Or with `yarn`:

```
yarn install
```

## Build
You can now customize the appearance (`index.html`) and the behaviour (`app.js`) of this add-in. Do not forget
to create a new GUID for `OfficeApp/Id` in `portal-to-excel-addin-manifest.xml`.

If you change the Node server settings in `bsconfig.json` you must also update all the links
in `portal-to-excel-addin-manifest.xml`.

When you are done you can build your application with `npm`:

```
npm run build
```

Or with `yarn`:

```
yarn build
```

You may need to add `certs/ca.crt` and `certs/server.crt` to your Trusted Certificate List. Follow the instructions
specific for your OS (do not forget to install `certs/ca.cert` as root certificate).
**DO NOT USE THESE CERTIFICATES** if not for testing, if you are developing your own Microsoft Excel add-in you MUST
have valid certificates.

## Start the development server
Now you need to start the Node server, with `npm`:

```
npm start
```

Or with `yarn`:

```
yarn start
```

The local development server is useful only for debugging and development, in production you probably
need an hosted environment (which does not need to be Node.js).

## Load the add-in in Microsoft Excel
This example has been tested with the on-line version of Microsoft Excel but it _should_ work also
with the desktop (Windows, iPad and Mac) versions (please consult Microsoft documentation for additional information).

* Sideload the add-in: [Sideload Office Add-ins in Office Online](https://docs.microsoft.com/en-us/office/dev/add-ins/testing/sideload-office-add-ins-for-testing#sideload-an-office-add-in-in-office-online). The manifest file to select is `portal-to-excel-addin-manifest-xml`.

## Use the add-in
* In the **Home** tab select **Resource Observer** in the **Arm Pelion** group.
* Enter the API Key: [Integrating web applications](https://cloud.mbed.com/docs/current/integrate-web-app/index.html).
* Enter the ID of the device and the full URL of the (observable) resource you want to monitor.
* Click the **Add subscription** button.