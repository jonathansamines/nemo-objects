# Nemo Objects

Easily implement and use the Page Object pattern in your nemo based tests, by using a simple api, mostly inspired by the [ember-cli-page-object](https://github.com/san650/ember-cli-page-object) ember addon, widely used in the ember ecosystem for functional and integration testing.

## Installation

```bash
  npm install --save nemo-objects
```

## Usage

### Configuring the nemo plugin

In your nemo configuration, with an absolute path specify where your page objects are.

```json
{
  "plugins": {
    "nemo-objects": {
      "module": "nemo-objects",
      "arguments": [
        {
          "pagesLocation": "/path/to/page-objects"
        }
      ]
    }
  }
}
```

### Creating a page object

At the specified location, for any given file found a page object will be created at the `nemo.objects` namespace. For example, if a file named `countryCenter.js` is found, then a page object is created as `nemo.object.countryCenter`.

At the `countryCenter.js` file, a page-object can be declared as follows:

```js
'use strict';

module.exports = function countryCenterPage(pageObject, nemo) {
  const { visitable, collection, text } = pageObject;

  return {
    visit: visitable(`${nemo.data.url}/country-center`),
    countries: collection({
      scope: '.country-list',
      itemScope: 'ul li',
      item: {
        countryName: text('span')
      }
    })
  };
};
```

Which later can be used at your functional tests as:

```js
'use strict';

// all the setup code for your nemo environment
// The `nemo` variable is made available here

describe('At the country center page', () => {
  it('All user countries are shown', async () => {
    const { countryCenter } = nemo.objects;

    await countryCenter.visit();
    const countries = await countryCenter.countries();

    expect(countries.length).to.be.equal(4, 'the number of countries matches the user settings');
  });
});
```

## API

### Plugin configuration

+ `options`
  + `pagesLocation` - An absolute path indicating where you page objects are

### Page objects

Each module located at the specified location should export a function, which receives the following arguments:

+ `pageObject` - Holds the pageObject helper functions to be used along with your page objects
+ `nemo` - The nemo instance

Each module is expected to return an object describing the page object.
