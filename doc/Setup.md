
# Setup and Run

------------------------------------------------------------

You need a CWA authorization key to run this pure frotend web app.


## How to get a CWA authorization key?

After being a registered user on https://opendata.cwa.gov.tw , login the website, and click the button `Get Authorization Key`.


## How to Run this app?

1. Clone this repository into a folder or directory.

2. Add file `/auth/authorization.js` (in `UTF-8` encoding), and make sure its content looks like:

	 ```
	 export const Authorization = 'XXX-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX';   // replace it with your authoreization
	 ```

3. Replace the value with your own authorization.

4. Run `npm install` in the folder or directory you cloned into.

5. Run `npm start`, or run `vite`.

6. Browse the URL that vite provided, ex: `http://localhost:5990`.

------------------------------------------------------------
(end)