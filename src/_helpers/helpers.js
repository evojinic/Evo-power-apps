/* eslint-disable no-undef */

const gcd_rec = (a, b) => {
  if (b) return gcd_rec(b, a % b);
  return Math.abs(a);
};

export default {
  methods: {
    handleStringID: (string, rLong, customPad = '0') => {
      if (!string) return '';
      if (string === 'Inventory') return 'Inventory';

      let oLength = string.length;
      const maxL = 10;
      let z2add = 0;
      let zeros = '';
      let leadingLetterCount = 0;
      let foundLeadingLetters = false;
      let leadingLetters = '';
      let justNumbers = '';

      while (!foundLeadingLetters && oLength > 0) {
        if (isNaN(parseInt(string.charAt(leadingLetterCount), 10))) leadingLetterCount++;
        else foundLeadingLetters = true;
        oLength--;
      }

      if (leadingLetterCount > 0) {
        leadingLetters = string.slice(0, parseInt(leadingLetterCount, 10)).replace(/0/g, '');
      }
      justNumbers = string.slice(leadingLetterCount).replace(/^(0+)/g, '');

      if (rLong) {
        z2add = maxL - leadingLetterCount - justNumbers.length;
        for (let i = 0; i < z2add; i++) {
          zeros += customPad;
        }
      }

      return leadingLetters.toUpperCase() + zeros + justNumbers;
    },
    qtyIncrement: ({ product, boltSize, sleeveM }) => {
      if (product === 'isoTube') {
        if (sleeveM === 'MM') return 3;
        if (isNaN(boltSize)) return 3.28;
        return 6;
      }
      return 1;
    },
    numberFormat: (number, sig) => {
      if (!number) {
        return number;
      }
      // eslint-disable-next-line no-restricted-globals
      if (isNaN(number)) {
        return number;
      }
      return parseFloat(number).toFixed(sig).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    fraction(decimal, withQuotes = true) {
      // if metric call out; ex: M16
      if (toString(decimal).indexOf('M') !== -1) return decimal;

      const decimalSplit = decimal.toString().split('.');
      let com = 0;
      const rDin = 16;
      let whole = false;
      let rNum = false;
      const quote = withQuotes ? '"' : '';

      if (decimalSplit[0] > 0) whole = decimalSplit[0];

      if (decimalSplit[1] && decimalSplit[1] >= 0 && !isNaN(decimalSplit[1])) {
        const dec = parseFloat(`0.${decimalSplit[1]}`);
        const num = parseInt(dec * 10000, 10);
        const dNom = 10000 / rDin;
        const mod = num % dNom;

        if (mod > 200) rNum = (num - num % dNom) / dNom + 1;
        else rNum = (num - num % dNom) / dNom;

        com = gcd_rec(rNum, rDin);

        if (rNum === rDin) {
          whole++;
          rNum = false;
        }
      }

      if (whole && rNum) return `${whole}-${rNum / com}/${rDin / com}${quote}`;
      if (whole && !rNum) return whole + quote;
      if (com > 0) return `${rNum / com}/${rDin / com}${quote}`;
      return decimal;
    },
    greaterThan(n1, n2) {
      if (n1 > 0 && n2 > 0) {
        if (n1 > n2) {
          return true;
        }
      }
      return false;
    },
    formatDate(stringDate) {
      const date = new Date(stringDate);
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    },
    dt(due) {
      const dO = new Date(due);
      // date
      const y = dO.getFullYear();
      let m = dO.getMonth() + 1;
      if (m < 10) m = `0${m}`;
      let d = dO.getDate();
      if (d < 10) d = `0${d}`;
      // time
      let min = dO.getMinutes();
      if (min < 10) min = `0${min}`;
      let h = dO.getHours();
      if (h < 10) h = `0${h}`;
      return { date: `${y}-${m}-${d}`, time: `${h}:${min}` };
    },
    // dom copy
    copyByID(id) {
      // e = e || event; // equalize event object between modern and older IE browsers
      // const target = e.target || e.srcElement; // get target element mouse is over
      const target = document.getElementById(id); // get target element mouse is over
      this.selectElementText(target); // select the element's text we wish to read
      const success = this.copySelectionText();
      if (success) {
        this.$store.dispatch('alert/success', { message: 'copied ready to paste', title: id });
        // target.style.color = "green";
        // this.copySuccessful(target);
      }
    },
    copyTD(e) {
      // e = e || event; // equalize event object between modern and older IE browsers
      // get target element mouse is over
      const target = e.target || e.srcElement;
      // get target element mouse is over
      // let target = document.getElementById("q-copy-paste-copy");
      // select the element's text we wish to read
      this.selectElementText(target);
      const success = this.copySelectionText();
      if (success) {
        target.style.color = 'green';
        this.$store.dispatch('alert/success', { message: 'copied ready to paste', title: target.innerText });
        // this.copySuccessful(target);
      }
    },
    selectElementText(el) {
      // create new range object
      const range = document.createRange();
      // set range to encompass desired element text
      range.selectNodeContents(el);
      // get Selection object from currently user selected text
      const selection = window.getSelection();
      // unselect any user selected text (if any)
      selection.removeAllRanges();
      // add range to Selection object to select it
      selection.addRange(range);
    },
    copySelectionText() {
      try {
        return document.execCommand('copy'); // run command to copy selected text to clipboard
      }
      catch (e) {
        return false;
      }
    },
    trqData(item) {
      const torqueArray = item.trq;
      if (!torqueArray) {
        if (!item.d) return false;
        if (!item.d.brand) return false;
        if (item.d.brand.minGasketStress) return { error: { type: 'Code Update', exp: 'Torque Calculation was moved to the server to enable customization of k-factor and bolt type ... to get torque to show: select all, then edit items, then click green check mark ... note price may update to newest value ... to customize k-factor or bolt type click Show Customization Options in item edit' } };
      }
      if (torqueArray && torqueArray.error) return false;
      if (!torqueArray.values) return false;

      const { values: trqV, results, torqueDisclaimer } = torqueArray;
      let trqC = 'Raised Face';
      if (!results[trqC]) trqC = 'Ring Type Joint';
      if (!results[trqC]) trqC = 'Seal Area';
      if (item.q.spec === 'API') {
        trqC = 'Ring Type Joint';
        if (!results[trqC]) trqC = 'Kamm';
      }
      else {
        if (results.Kamm) trqC = 'Kamm';
        if (!results[trqC] || !results[trqC].min) trqC = 'Full Face';
      }

      const trqR = results[trqC];

      if (!trqR) return false;
      return { trqR, trqV, trqC, torqueDisclaimer };
    },
  },
};
