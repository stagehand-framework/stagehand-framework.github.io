/* global document, window, hljs, $ */

document.addEventListener('DOMContentLoaded', () => {
  const apexLogo = document.querySelector('#apex-logo');
  const nav = document.querySelector('nav');
  const navLinks = document.querySelectorAll('#site-navigation a');
  const main = document.querySelector('main');
  const header = document.querySelector('header');
  const ourTeam = document.querySelector('#our-team');
  const homeLink = document.querySelector('#home-link');
  const $caseStudyNav = $('#case-study nav');
  const caseStudyNav = document.querySelector('#case-study nav');
  const $sideNavLogo = $('#side-nav');
  const caseStudyLink = document.querySelector('#case-study-link');
  const ourTeamLink = document.querySelector('#our-team-link');
  const caseStudyNavUl = document.querySelector('#case-study nav ul');
  const mobileCaseStudyNavUl = document.querySelector('#case-study-mobile ul');
  const $toTop = $('#toTop-logo');

  $toTop.on('click', function (e) {
    e.preventDefault();
    $([document.documentElement, document.body]).animate(
      {
        scrollTop: $('#introduction').offset().top,
      },
      2000,
    );
  });

  let topNavVisible = false;
  let smallNavVisible = false;
  const getScrollPosition = () => window.scrollY;
  let scrollPosition = getScrollPosition();
  const getWindowHeight = () => window.innerHeight;
  const getWindowWidth = () => window.innerWidth;
  const isNarrowScreen = () => getWindowWidth() < 1100;

  const logos = [...document.querySelectorAll('.logo-links img')]
    .filter((logo) => !/apex/.test(logo.id))
    .map((logo) => logo.id.split('-')[0]);

  const snakeCaseify = (text) => text.toLowerCase().split(/ +/).join('-').replace(/\./g, '_');

  const removeAmpersand = (text) => text.replace('&', '');

  let lastH2Id;
  const linkableHeaders = [...document.querySelectorAll('#case-study h2, #case-study h3, #our-team h1')].map((el) => {
    if (el.nodeName === 'H2') {
      lastH2Id = el.id;
    }

    return {
      el,
      type: el.nodeName,
      text: el.textContent.replace(/^.*\) /, ''),
      parentId: lastH2Id
    }
  });

  const paddingAllowanceAboveHeading = 30;

  const getCaseStudyHeadingPositions = () =>
    linkableHeaders.reduce((obj, headerObj) => {
      const selector = `#${snakeCaseify(removeAmpersand(headerObj.text))}`;
      const header = document.querySelector(selector);
      const position =
        getScrollPosition() + header.getBoundingClientRect().top - paddingAllowanceAboveHeading;
      obj[`${selector}-nav`] = {
        position,
        headerData: headerObj
      };

      return obj;
    }, {});

  const highlightSection = (li, a) => {
    li.style.listStyle = 'disc';

    li.style.color = '#248F99';
    a.style.color = '#248F99';
  };

  const mobileCaseStudyLinks = [];

  (function () {
    let lastH2Id;

    linkableHeaders.forEach((headerObj) => {
      if (headerObj.type === 'H2') {
        lastH2Id = headerObj.el.id;
      } else {
        headerObj.parentId = lastH2Id;
      }

      const li = document.createElement('li');
      li.id = snakeCaseify(`${removeAmpersand(headerObj.text).replace('!', '').toLowerCase()}-nav`);
      li.dataset['parentHeaderId'] = lastH2Id;
      li.dataset['tagType'] = headerObj.el.nodeName;

      const a = document.createElement('a');
      a.href = snakeCaseify(`#${removeAmpersand(headerObj.text).replace('!', '')}`);
      a.textContent = headerObj.text.toUpperCase();
      a.className = 'case-study-anchor';

      li.appendChild(a);
      caseStudyNavUl.appendChild(li);

      if (headerObj.type === 'H2') {
        const li2 = document.createElement('li');
        li2.id = snakeCaseify(
          `mobile-${removeAmpersand(headerObj.text).replace('!', '').toLowerCase()}-nav`,
        );
        li2.dataset['parentHeaderId'] = lastH2Id;
        li2.dataset['tagType'] = headerObj.el.nodeName;

        const a2 = document.createElement('a');
        a2.href = snakeCaseify(`#${removeAmpersand(headerObj.text).replace('!', '')}`);
        a2.textContent = headerObj.text.toUpperCase();

        mobileCaseStudyLinks.push(a2);
        li2.appendChild(a2);
        mobileCaseStudyNavUl.appendChild(li2);
      }

      headerObj.navEl = li;
    });
  }());

  const changeImgSrc = (tag, url) => {
    document.querySelector(`#${tag}`).src = url;
  };

  const logoUrls = {
    githubWhite: './images/logos/github_white.png',
    githubBlack: './images/logos/github_black.png',
  };

  const isOnHeader = (logo) => {
    const position = getScrollPosition();
    const logoSelector = `#${logo}-logo`;
    const logoElement = document.querySelector(logoSelector);
    const logoHeight = logoElement.height;
    const logoBottom = +window.getComputedStyle(logoElement).bottom.replace('px', '');
    const logoOffset = logoHeight + logoBottom;
    return position < logoOffset;
  };

  const isOnTeamSection = (logo) => {
    const position = getScrollPosition();
    const ourTeamOffset = ourTeam.getBoundingClientRect().top;
    const ourTeamPosition = position + ourTeamOffset;
    const logoSelector = `#${logo}-logo`;
    const logoElement = document.querySelector(logoSelector);
    const logoHeight = logoElement.height;
    const logoBottom = +window.getComputedStyle(logoElement).bottom.replace('px', '');
    const logoOffset = logoHeight + logoBottom;
    const logoPosition = position + getWindowHeight() - logoOffset;
    return logoPosition > ourTeamPosition;
  };

  const changeLogoColors = () => {
    logos.forEach((logo) => {
      const onHeader = isOnHeader(logo);
      const onTeam = isOnTeamSection(logo);

      if (onTeam) {
        changeImgSrc(`${logo}-logo`, logoUrls[`${logo}Black`]);
      } else if (onHeader) {
        changeImgSrc(`${logo}-logo`, logoUrls[`${logo}Black`]);
      } else {
        changeImgSrc(`${logo}-logo`, logoUrls[`${logo}Black`]);
      }
    });
  };

  const handleCaseStudyNavStyles = () => {
    const positions = getCaseStudyHeadingPositions();
    const positionValues = Object.values(positions);
    const positionSelectors = Object.keys(positions);
    const mobileCaseStudyNav = document.querySelector('#case-study-mobile');
    const position = getScrollPosition();

    const currentParent = document.querySelector('nav li.active-parent');
    const currentChildren = document.querySelectorAll('nav li.active-child');
    let newParentId;

    positionValues.forEach((_, i) => {
      const currentData = positionValues[i].headerData;
      const li = currentData.navEl;
      const a = li.getElementsByTagName('a')[0];
      const currPosition = i > 0 ? positionValues[i].position : 0;
      const nextPositionIdx = i + 1;
      const nextPosition =
        (positionValues[nextPositionIdx] &&
          positionValues[nextPositionIdx].position) || 999999;
      const windowPositionIsAtLi = position >= currPosition && position < nextPosition;

      if (windowPositionIsAtLi && !mobileCaseStudyNav.contains(li)) {
        highlightSection(li, a);

        newParentId = currentData.parentId;
      } else {
        if (li.getAttribute('style')) li.removeAttribute('style');
        if (a.getAttribute('style')) a.removeAttribute('style');
      }
    });

    if (currentParent) {
      currentParent.classList.remove('active-parent');
    }

    currentChildren.forEach(child => child.classList.remove('active-child'));

    newActive = document.querySelectorAll(`[data-parent-header-id="${newParentId}"]`)
    newActive.forEach(el => {
      el.classList.add('active-child');
    });
  };

  const handleCaseStudyNav = () => {
    const position = getScrollPosition();
    const ourTeamPosition = position + ourTeam.getBoundingClientRect().top;
    const mainPosition = position + main.getBoundingClientRect().top;
    const withinCaseStudy =
      position >= mainPosition && position < ourTeamPosition - getWindowHeight();

    if (getWindowHeight() < 650 || getWindowWidth() < 1100) {
      $sideNavLogo.stop(true, true).css('display', 'none');
      $caseStudyNav.stop(true, true).css('display', 'none');
    } else if (withinCaseStudy) {
      $sideNavLogo.fadeIn(800);
      $caseStudyNav.fadeIn(800);
      $toTop.fadeIn(800);

      handleCaseStudyNavStyles();
    } else {
      $sideNavLogo.stop(true, true).css('display', 'none');
      $caseStudyNav.stop(true, true).css('display', 'none');
      $toTop.stop(true, true).css('display', 'none');
    }

    if (getWindowHeight() < 500) {
      $toTop.stop(true, true).css('display', 'none');
    } else if (withinCaseStudy) {
      $toTop.fadeIn(800);
    } else {
      $toTop.stop(true, true).css('display', 'none');
    }
  };

  const styleNavColors = (bgColor, textColor, hoverColor) => {
    nav.style.backgroundColor = bgColor;
    const links = Array.prototype.slice.call(navLinks).concat(mobileCaseStudyLinks);
    links.forEach((link) => {
      link.style.color = textColor;

      link.addEventListener('mouseenter', () => {
        link.style.color = hoverColor;
      });

      link.addEventListener('mouseleave', () => {
        link.style.color = textColor;
      });
    });
  };

  const handleNavColors = () => {
    const onHeader = isOnHeader('apex');
    const onTeam = isOnTeamSection('apex');
    const onMain = !(onHeader || onTeam);
    const isWideScreen = !isNarrowScreen();

    if (isWideScreen && !onMain && topNavVisible) {
      styleNavColors('#f7f7f7', '#65c8d0', '#248F99');
      changeImgSrc('apex-logo', 'images/logos/crato-logo.png'); // black
    } else {
      styleNavColors('#f7f7f7', '#65c8d0', '#248F99');
      changeImgSrc('apex-logo', 'images/logos/crato-logo.png');
    }
  };

  const showNav = () => {
    const position = getScrollPosition();
    const narrowScreen = isNarrowScreen();
    topNavVisible = true;

    handleNavColors();
    scrollPosition = position;

    if (narrowScreen) document.body.style.backgroundColor = '#282828';
    $(nav).slideDown('fast');
  };

  const showSite = () => {
    const siteElements = [header, main, ourTeam, document.body];
    // remove "display = 'none'" set when small nav was displayed
    siteElements.forEach((el) => el.removeAttribute('style'));
  };

  const hideSite = () => {
    header.style.display = 'none';
    main.style.display = 'none';
    ourTeam.style.display = 'none';
  };

  const hideNav = () => {
    smallNavVisible = false;
    topNavVisible = false;
    handleNavColors();
    $(nav).slideUp('fast');
    showSite();
  };

  const toggleNav = () => {
    if (smallNavVisible) {
      hideNav();
      window.scrollTo(0, scrollPosition);
    } else {
      showNav();
      smallNavVisible = true;
      hideSite();
    }
  };

  const handleNavDisplay = () => {
    if (isNarrowScreen()) {
      toggleNav();
    } else {
      showNav();
    }
  };

  apexLogo.addEventListener('click', handleNavDisplay);
  main.addEventListener('mouseenter', hideNav);
  ourTeam.addEventListener('mouseenter', hideNav);
  header.addEventListener('mouseenter', hideNav);
  homeLink.addEventListener('click', hideNav);
  caseStudyLink.addEventListener('click', hideNav);
  mobileCaseStudyLinks.forEach((link) => link.addEventListener('click', hideNav));
  ourTeamLink.addEventListener('click', hideNav);

  document.addEventListener('scroll', () => {
    if (!smallNavVisible) {
      changeLogoColors();
      handleCaseStudyNav();
    }
    handleNavColors();
  });

  window.addEventListener('resize', () => {
    handleCaseStudyNav();
    handleNavColors();
    if (!isNarrowScreen() && smallNavVisible) {
      showSite();
      hideNav();
      window.scrollTo(0, scrollPosition);
    }
  });

  caseStudyNav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      e.preventDefault();
      const positions = getCaseStudyHeadingPositions();
      const positionKey = `#${e.target.href.split('#')[1]}-nav`;
      const newScrollPosition = positions[positionKey].position;
      window.scrollTo(0, newScrollPosition + 5);
    }
  });

  hljs.initHighlightingOnLoad();
});
