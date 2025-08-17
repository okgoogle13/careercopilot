var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/matchers.ts
var matchers_exports = {};
__export(matchers_exports, {
  toBeChecked: () => toBeChecked,
  toBeDisabled: () => toBeDisabled,
  toBeEmpty: () => toBeEmpty,
  toBeEmptyDOMElement: () => toBeEmptyDOMElement,
  toBeEnabled: () => toBeEnabled,
  toBeInTheDOM: () => toBeInTheDOM,
  toBeInTheDocument: () => toBeInTheDocument,
  toBeInvalid: () => toBeInvalid,
  toBePartiallyChecked: () => toBePartiallyChecked,
  toBeRequired: () => toBeRequired,
  toBeValid: () => toBeValid,
  toBeVisible: () => toBeVisible,
  toContainElement: () => toContainElement,
  toContainHTML: () => toContainHTML,
  toHaveAccessibleDescription: () => toHaveAccessibleDescription,
  toHaveAccessibleName: () => toHaveAccessibleName,
  toHaveAttribute: () => toHaveAttribute,
  toHaveClass: () => toHaveClass,
  toHaveDescription: () => toHaveDescription,
  toHaveDisplayValue: () => toHaveDisplayValue,
  toHaveErrorMessage: () => toHaveErrorMessage,
  toHaveFocus: () => toHaveFocus,
  toHaveFormValues: () => toHaveFormValues,
  toHaveStyle: () => toHaveStyle,
  toHaveTextContent: () => toHaveTextContent,
  toHaveValue: () => toHaveValue
});

// src/utils.ts
import redent from "redent";

// src/css-parse.js
var commentre = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;
function cssParse(css, options) {
  options = options || {};
  let lineno = 1;
  let column = 1;
  function updatePosition(str) {
    let lines = str.match(/\n/g);
    if (lines)
      lineno += lines.length;
    let i = str.lastIndexOf("\n");
    column = ~i ? str.length - i : column + str.length;
  }
  function position() {
    let start = { line: lineno, column };
    return function(node) {
      node.position = new Position(start);
      whitespace();
      return node;
    };
  }
  function Position(start) {
    this.start = start;
    this.end = { line: lineno, column };
    this.source = options.source;
  }
  Position.prototype.content = css;
  let errorsList = [];
  function error(msg) {
    let err = new Error(
      options.source + ":" + lineno + ":" + column + ": " + msg
    );
    err.reason = msg;
    err.filename = options.source;
    err.line = lineno;
    err.column = column;
    err.source = css;
    if (options.silent) {
      errorsList.push(err);
    } else {
      throw err;
    }
  }
  function stylesheet() {
    let rulesList = rules();
    return {
      type: "stylesheet",
      stylesheet: {
        source: options.source,
        rules: rulesList,
        parsingErrors: errorsList
      }
    };
  }
  function open() {
    return match(/^{\s*/);
  }
  function close() {
    return match(/^}/);
  }
  function rules() {
    let node;
    let rules2 = [];
    whitespace();
    comments(rules2);
    while (css.length && css.charAt(0) != "}" && (node = atrule() || rule())) {
      if (node !== false) {
        rules2.push(node);
        comments(rules2);
      }
    }
    return rules2;
  }
  function match(re) {
    let m = re.exec(css);
    if (!m)
      return;
    let str = m[0];
    updatePosition(str);
    css = css.slice(str.length);
    return m;
  }
  function whitespace() {
    match(/^\s*/);
  }
  function comments(rules2) {
    let c;
    rules2 = rules2 || [];
    while (c = comment()) {
      if (c !== false) {
        rules2.push(c);
      }
    }
    return rules2;
  }
  function comment() {
    let pos = position();
    if ("/" != css.charAt(0) || "*" != css.charAt(1))
      return;
    let i = 2;
    while ("" != css.charAt(i) && ("*" != css.charAt(i) || "/" != css.charAt(i + 1)))
      ++i;
    i += 2;
    if ("" === css.charAt(i - 1)) {
      return error("End of comment missing");
    }
    let str = css.slice(2, i - 2);
    column += 2;
    updatePosition(str);
    css = css.slice(i);
    column += 2;
    return pos({
      type: "comment",
      comment: str
    });
  }
  function selector() {
    let m = match(/^([^{]+)/);
    if (!m)
      return;
    return trim(m[0]).replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*\/+/g, "").replace(/"(?:\\"|[^"])*"|'(?:\\'|[^'])*'/g, function(m2) {
      return m2.replace(/,/g, "\u200C");
    }).split(/\s*(?![^(]*\)),\s*/).map(function(s) {
      return s.replace(/\u200C/g, ",");
    });
  }
  function declaration() {
    let pos = position();
    let prop = match(/^(\*?[-#\/\*\\\w]+(\[[0-9a-z_-]+\])?)\s*/);
    if (!prop)
      return;
    prop = trim(prop[0]);
    if (!match(/^:\s*/))
      return error("property missing ':'");
    let val = match(/^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^\)]*?\)|[^};])+)/);
    let ret = pos({
      type: "declaration",
      property: prop.replace(commentre, ""),
      value: val ? trim(val[0]).replace(commentre, "") : ""
    });
    match(/^[;\s]*/);
    return ret;
  }
  function declarations() {
    let decls = [];
    if (!open())
      return error("missing '{'");
    comments(decls);
    let decl;
    while (decl = declaration()) {
      if (decl !== false) {
        decls.push(decl);
        comments(decls);
      }
    }
    if (!close())
      return error("missing '}'");
    return decls;
  }
  function keyframe() {
    let m;
    let vals = [];
    let pos = position();
    while (m = match(/^((\d+\.\d+|\.\d+|\d+)%?|[a-z]+)\s*/)) {
      vals.push(m[1]);
      match(/^,\s*/);
    }
    if (!vals.length)
      return;
    return pos({
      type: "keyframe",
      values: vals,
      declarations: declarations()
    });
  }
  function atkeyframes() {
    let pos = position();
    let m = match(/^@([-\w]+)?keyframes\s*/);
    if (!m)
      return;
    let vendor = m[1];
    m = match(/^([-\w]+)\s*/);
    if (!m)
      return error("@keyframes missing name");
    let name = m[1];
    if (!open())
      return error("@keyframes missing '{'");
    let frame;
    let frames = comments();
    while (frame = keyframe()) {
      frames.push(frame);
      frames = frames.concat(comments());
    }
    if (!close())
      return error("@keyframes missing '}'");
    return pos({
      type: "keyframes",
      name,
      vendor,
      keyframes: frames
    });
  }
  function atsupports() {
    let pos = position();
    let m = match(/^@supports *([^{]+)/);
    if (!m)
      return;
    let supports = trim(m[1]);
    if (!open())
      return error("@supports missing '{'");
    let style = comments().concat(rules());
    if (!close())
      return error("@supports missing '}'");
    return pos({
      type: "supports",
      supports,
      rules: style
    });
  }
  function athost() {
    let pos = position();
    let m = match(/^@host\s*/);
    if (!m)
      return;
    if (!open())
      return error("@host missing '{'");
    let style = comments().concat(rules());
    if (!close())
      return error("@host missing '}'");
    return pos({
      type: "host",
      rules: style
    });
  }
  function atmedia() {
    let pos = position();
    let m = match(/^@media *([^{]+)/);
    if (!m)
      return;
    let media = trim(m[1]);
    if (!open())
      return error("@media missing '{'");
    let style = comments().concat(rules());
    if (!close())
      return error("@media missing '}'");
    return pos({
      type: "media",
      media,
      rules: style
    });
  }
  function atcustommedia() {
    let pos = position();
    let m = match(/^@custom-media\s+(--[^\s]+)\s*([^{;]+);/);
    if (!m)
      return;
    return pos({
      type: "custom-media",
      name: trim(m[1]),
      media: trim(m[2])
    });
  }
  function atpage() {
    let pos = position();
    let m = match(/^@page */);
    if (!m)
      return;
    let sel = selector() || [];
    if (!open())
      return error("@page missing '{'");
    let decls = comments();
    let decl;
    while (decl = declaration()) {
      decls.push(decl);
      decls = decls.concat(comments());
    }
    if (!close())
      return error("@page missing '}'");
    return pos({
      type: "page",
      selectors: sel,
      declarations: decls
    });
  }
  function atdocument() {
    let pos = position();
    let m = match(/^@([-\w]+)?document *([^{]+)/);
    if (!m)
      return;
    let vendor = trim(m[1]);
    let doc = trim(m[2]);
    if (!open())
      return error("@document missing '{'");
    let style = comments().concat(rules());
    if (!close())
      return error("@document missing '}'");
    return pos({
      type: "document",
      document: doc,
      vendor,
      rules: style
    });
  }
  function atfontface() {
    let pos = position();
    let m = match(/^@font-face\s*/);
    if (!m)
      return;
    if (!open())
      return error("@font-face missing '{'");
    let decls = comments();
    let decl;
    while (decl = declaration()) {
      decls.push(decl);
      decls = decls.concat(comments());
    }
    if (!close())
      return error("@font-face missing '}'");
    return pos({
      type: "font-face",
      declarations: decls
    });
  }
  let atimport = _compileAtrule("import");
  let atcharset = _compileAtrule("charset");
  let atnamespace = _compileAtrule("namespace");
  function _compileAtrule(name) {
    let re = new RegExp("^@" + name + "\\s*([^;]+);");
    return function() {
      let pos = position();
      let m = match(re);
      if (!m)
        return;
      let ret = { type: name };
      ret[name] = m[1].trim();
      return pos(ret);
    };
  }
  function atrule() {
    if (css[0] != "@")
      return;
    return atkeyframes() || atmedia() || atcustommedia() || atsupports() || atimport() || atcharset() || atnamespace() || atdocument() || atpage() || athost() || atfontface();
  }
  function rule() {
    let pos = position();
    let sel = selector();
    if (!sel)
      return error("selector missing");
    comments();
    return pos({
      type: "rule",
      selectors: sel,
      declarations: declarations()
    });
  }
  return addParent(stylesheet());
}
function trim(str) {
  return str ? str.replace(/^\s+|\s+$/g, "") : "";
}
function addParent(obj, parent) {
  let isNode = obj && typeof obj.type === "string";
  let childParent = isNode ? obj : parent;
  for (var k in obj) {
    let value = obj[k];
    if (Array.isArray(value)) {
      value.forEach(function(v) {
        addParent(v, childParent);
      });
    } else if (value && typeof value === "object") {
      addParent(value, childParent);
    }
  }
  if (isNode) {
    Object.defineProperty(obj, "parent", {
      configurable: true,
      writable: true,
      enumerable: false,
      value: parent || null
    });
  }
  return obj;
}
var css_parse_default = cssParse;

// src/utils.ts
import { isEqual } from "lodash-es";
var GenericTypeError = class extends Error {
  constructor(expectedString, received, matcherFn, context) {
    super();
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, matcherFn);
    }
    let withType = "";
    try {
      withType = context.utils.printWithType(
        "Received",
        received,
        context.utils.printReceived
      );
    } catch (e) {
    }
    this.message = [
      context.utils.matcherHint(
        `${context.isNot ? ".not" : ""}.${matcherFn.name}`,
        "received",
        ""
      ),
      "",
      `${context.utils.RECEIVED_COLOR(
        "received"
      )} value must ${expectedString}.`,
      withType
    ].join("\n");
  }
};
var HtmlElementTypeError = class extends GenericTypeError {
  constructor(element, matcherFn, context) {
    super("be an HTMLElement or an SVGElement", element, matcherFn, context);
  }
};
var NodeTypeError = class extends GenericTypeError {
  constructor(element, matcherFn, context) {
    super("be a Node", element, matcherFn, context);
  }
};
function checkHasWindow(htmlElement, ErrorClass, matcherFn, context) {
  if (!htmlElement || !htmlElement.ownerDocument || !htmlElement.ownerDocument.defaultView) {
    throw new ErrorClass(htmlElement, matcherFn, context);
  }
}
function checkNode(node, matcherFn, context) {
  checkHasWindow(node, NodeTypeError, matcherFn, context);
  const window = node.ownerDocument.defaultView;
  if (!(node instanceof window.Node)) {
    throw new NodeTypeError(node, matcherFn, context);
  }
}
function checkHtmlElement(htmlElement, matcher, context) {
  checkHasWindow(htmlElement, HtmlElementTypeError, matcher, context);
  const window = htmlElement.ownerDocument.defaultView;
  if (!(htmlElement instanceof window.HTMLElement) && // @ts-expect-error
  !(htmlElement instanceof window.SVGElement)) {
    throw new HtmlElementTypeError(htmlElement, matcher, context);
  }
}
var InvalidCSSError = class extends Error {
  constructor(received, matcherFn, context) {
    super();
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, matcherFn);
    }
    this.message = [
      received.message,
      "",
      context.utils.RECEIVED_COLOR(`Failing css:`),
      context.utils.RECEIVED_COLOR(`${received.css}`)
    ].join("\n");
  }
};
function parseCSS(css, matcherFn, context) {
  const ast = css_parse_default(`selector { ${css} }`, { silent: true }).stylesheet;
  if (ast.parsingErrors && ast.parsingErrors.length > 0) {
    const { reason, line } = ast.parsingErrors[0];
    throw new InvalidCSSError(
      {
        css,
        message: `Syntax error parsing expected css: ${reason} on line: ${line}`
      },
      matcherFn,
      context
    );
  }
  const parsedRules = ast.rules[0].declarations.filter((d) => d.type === "declaration").reduce(
    (obj, { property, value }) => Object.assign(obj, { [property]: value }),
    {}
  );
  return parsedRules;
}
function display(context, value) {
  return typeof value === "string" ? value : context.utils.stringify(value);
}
function getMessage(context, matcher, expectedLabel, expectedValue, receivedLabel, receivedValue) {
  return [
    `${matcher}
`,
    `${expectedLabel}:
${context.utils.EXPECTED_COLOR(
      redent(display(context, expectedValue), 2)
    )}`,
    `${receivedLabel}:
${context.utils.RECEIVED_COLOR(
      redent(display(context, receivedValue), 2)
    )}`
  ].join("\n");
}
function matches(textToMatch, matcher) {
  if (matcher instanceof RegExp) {
    return matcher.test(textToMatch);
  } else {
    return textToMatch.includes(String(matcher));
  }
}
function deprecate(name, replacementText) {
  console.warn(
    `Warning: ${name} has been deprecated and will be removed in future updates.`,
    replacementText
  );
}
function normalize(text) {
  return text.replace(/\s+/g, " ").trim();
}
function getTag(element) {
  return element.tagName && element.tagName.toLowerCase();
}
function getSelectValue({ multiple, options }) {
  const selectedOptions = [...options].filter((option) => option.selected);
  if (multiple) {
    return [...selectedOptions].map((opt) => opt.value);
  }
  if (selectedOptions.length === 0) {
    return void 0;
  }
  return selectedOptions[0].value;
}
function getInputValue(inputElement) {
  switch (inputElement.type) {
    case "number":
      return inputElement.value === "" ? null : Number(inputElement.value);
    case "checkbox":
      return inputElement.checked;
    default:
      return inputElement.value;
  }
}
function getSingleElementValue(element) {
  if (!element) {
    return void 0;
  }
  switch (element.tagName.toLowerCase()) {
    case "input":
      return getInputValue(element);
    case "select":
      return getSelectValue(element);
    default:
      return element.value;
  }
}
function compareArraysAsSet(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) {
    return isEqual(new Set(a), new Set(b));
  }
  return void 0;
}
function toSentence(array, { wordConnector = ", ", lastWordConnector = " and " } = {}) {
  return [array.slice(0, -1).join(wordConnector), array[array.length - 1]].join(
    array.length > 1 ? lastWordConnector : ""
  );
}

// src/to-be-in-the-dom.js
function toBeInTheDOM(element, container) {
  deprecate(
    "toBeInTheDOM",
    "Please use toBeInTheDocument for searching the entire document and toContainElement for searching a specific container."
  );
  if (element) {
    checkHtmlElement(element, toBeInTheDOM, this);
  }
  if (container) {
    checkHtmlElement(container, toBeInTheDOM, this);
  }
  return {
    pass: container ? container.contains(element) : !!element,
    message: () => {
      return [
        this.utils.matcherHint(
          `${this.isNot ? ".not" : ""}.toBeInTheDOM`,
          "element",
          ""
        ),
        "",
        "Received:",
        `  ${this.utils.printReceived(
          element ? element.cloneNode(false) : element
        )}`
      ].join("\n");
    }
  };
}

// src/to-be-in-the-document.js
function toBeInTheDocument(element) {
  if (element !== null || !this.isNot) {
    checkHtmlElement(element, toBeInTheDocument, this);
  }
  const pass = element === null ? false : element.ownerDocument === element.getRootNode({ composed: true });
  const errorFound = () => {
    return `expected document not to contain element, found ${this.utils.stringify(
      element.cloneNode(true)
    )} instead`;
  };
  const errorNotFound = () => {
    return `element could not be found in the document`;
  };
  return {
    pass,
    message: () => {
      return [
        this.utils.matcherHint(
          `${this.isNot ? ".not" : ""}.toBeInTheDocument`,
          "element",
          ""
        ),
        "",
        this.utils.RECEIVED_COLOR(this.isNot ? errorFound() : errorNotFound())
      ].join("\n");
    }
  };
}

// src/to-be-empty.js
function toBeEmpty(element) {
  deprecate(
    "toBeEmpty",
    "Please use instead toBeEmptyDOMElement for finding empty nodes in the DOM."
  );
  checkHtmlElement(element, toBeEmpty, this);
  return {
    pass: element.innerHTML === "",
    message: () => {
      return [
        this.utils.matcherHint(
          `${this.isNot ? ".not" : ""}.toBeEmpty`,
          "element",
          ""
        ),
        "",
        "Received:",
        `  ${this.utils.printReceived(element.innerHTML)}`
      ].join("\n");
    }
  };
}

// src/to-be-empty-dom-element.js
function toBeEmptyDOMElement(element) {
  checkHtmlElement(element, toBeEmptyDOMElement, this);
  return {
    pass: isEmptyElement(element),
    message: () => {
      return [
        this.utils.matcherHint(
          `${this.isNot ? ".not" : ""}.toBeEmptyDOMElement`,
          "element",
          ""
        ),
        "",
        "Received:",
        `  ${this.utils.printReceived(element.innerHTML)}`
      ].join("\n");
    }
  };
}
function isEmptyElement(element) {
  const nonCommentChildNodes = [...element.childNodes].filter(
    (node) => node.nodeType !== 8
  );
  return nonCommentChildNodes.length === 0;
}

// src/to-contain-element.js
function toContainElement(container, element) {
  checkHtmlElement(container, toContainElement, this);
  if (element !== null) {
    checkHtmlElement(element, toContainElement, this);
  }
  return {
    pass: container.contains(element),
    message: () => {
      return [
        this.utils.matcherHint(
          `${this.isNot ? ".not" : ""}.toContainElement`,
          "element",
          "element"
        ),
        "",
        this.utils.RECEIVED_COLOR(`${this.utils.stringify(
          container.cloneNode(false)
        )} ${this.isNot ? "contains:" : "does not contain:"} ${this.utils.stringify(element ? element.cloneNode(false) : element)}
        `)
      ].join("\n");
    }
  };
}

// src/to-contain-html.js
function getNormalizedHtml(container, htmlText) {
  const div = container.ownerDocument.createElement("div");
  div.innerHTML = htmlText;
  return div.innerHTML;
}
function toContainHTML(container, htmlText) {
  checkHtmlElement(container, toContainHTML, this);
  if (typeof htmlText !== "string") {
    throw new Error(`.toContainHTML() expects a string value, got ${htmlText}`);
  }
  return {
    pass: container.outerHTML.includes(getNormalizedHtml(container, htmlText)),
    message: () => {
      return [
        this.utils.matcherHint(
          `${this.isNot ? ".not" : ""}.toContainHTML`,
          "element",
          ""
        ),
        "Expected:",
        `  ${this.utils.EXPECTED_COLOR(htmlText)}`,
        "Received:",
        `  ${this.utils.printReceived(container.cloneNode(true))}`
      ].join("\n");
    }
  };
}

// src/to-have-text-content.js
function toHaveTextContent(node, checkWith, options = { normalizeWhitespace: true }) {
  checkNode(node, toHaveTextContent, this);
  const textContent = options.normalizeWhitespace ? normalize(node.textContent) : node.textContent.replace(/\u00a0/g, " ");
  const checkingWithEmptyString = textContent !== "" && checkWith === "";
  return {
    pass: !checkingWithEmptyString && matches(textContent, checkWith),
    message: () => {
      const to = this.isNot ? "not to" : "to";
      return getMessage(
        this,
        this.utils.matcherHint(
          `${this.isNot ? ".not" : ""}.toHaveTextContent`,
          "element",
          ""
        ),
        checkingWithEmptyString ? `Checking with empty string will always match, use .toBeEmptyDOMElement() instead` : `Expected element ${to} have text content`,
        checkWith,
        "Received",
        textContent
      );
    }
  };
}

// src/to-have-accessible-description.js
import { computeAccessibleDescription } from "dom-accessibility-api";
function toHaveAccessibleDescription(htmlElement, expectedAccessibleDescription) {
  checkHtmlElement(htmlElement, toHaveAccessibleDescription, this);
  const actualAccessibleDescription = computeAccessibleDescription(htmlElement);
  const missingExpectedValue = arguments.length === 1;
  let pass = false;
  if (missingExpectedValue) {
    pass = actualAccessibleDescription !== "";
  } else {
    pass = expectedAccessibleDescription instanceof RegExp ? expectedAccessibleDescription.test(actualAccessibleDescription) : this.equals(
      actualAccessibleDescription,
      expectedAccessibleDescription
    );
  }
  return {
    pass,
    message: () => {
      const to = this.isNot ? "not to" : "to";
      return getMessage(
        this,
        this.utils.matcherHint(
          `${this.isNot ? ".not" : ""}.${toHaveAccessibleDescription.name}`,
          "element",
          ""
        ),
        `Expected element ${to} have accessible description`,
        expectedAccessibleDescription,
        "Received",
        actualAccessibleDescription
      );
    }
  };
}

// src/to-have-accessible-name.js
import { computeAccessibleName } from "dom-accessibility-api";
function toHaveAccessibleName(htmlElement, expectedAccessibleName) {
  checkHtmlElement(htmlElement, toHaveAccessibleName, this);
  const actualAccessibleName = computeAccessibleName(htmlElement);
  const missingExpectedValue = arguments.length === 1;
  let pass = false;
  if (missingExpectedValue) {
    pass = actualAccessibleName !== "";
  } else {
    pass = expectedAccessibleName instanceof RegExp ? expectedAccessibleName.test(actualAccessibleName) : this.equals(actualAccessibleName, expectedAccessibleName);
  }
  return {
    pass,
    message: () => {
      const to = this.isNot ? "not to" : "to";
      return getMessage(
        this,
        this.utils.matcherHint(
          `${this.isNot ? ".not" : ""}.${toHaveAccessibleName.name}`,
          "element",
          ""
        ),
        `Expected element ${to} have accessible name`,
        expectedAccessibleName,
        "Received",
        actualAccessibleName
      );
    }
  };
}

// src/to-have-attribute.js
function printAttribute(stringify, name, value) {
  return value === void 0 ? name : `${name}=${stringify(value)}`;
}
function getAttributeComment(stringify, name, value) {
  return value === void 0 ? `element.hasAttribute(${stringify(name)})` : `element.getAttribute(${stringify(name)}) === ${stringify(value)}`;
}
function toHaveAttribute(htmlElement, name, expectedValue) {
  checkHtmlElement(htmlElement, toHaveAttribute, this);
  const isExpectedValuePresent = expectedValue !== void 0;
  const hasAttribute = htmlElement.hasAttribute(name);
  const receivedValue = htmlElement.getAttribute(name);
  return {
    pass: isExpectedValuePresent ? hasAttribute && this.equals(receivedValue, expectedValue) : hasAttribute,
    message: () => {
      const to = this.isNot ? "not to" : "to";
      const receivedAttribute = hasAttribute ? printAttribute(this.utils.stringify, name, receivedValue) : null;
      const matcher = this.utils.matcherHint(
        `${this.isNot ? ".not" : ""}.toHaveAttribute`,
        "element",
        this.utils.printExpected(name),
        {
          secondArgument: isExpectedValuePresent ? this.utils.printExpected(expectedValue) : void 0,
          comment: getAttributeComment(
            this.utils.stringify,
            name,
            expectedValue
          )
        }
      );
      return getMessage(
        this,
        matcher,
        `Expected the element ${to} have attribute`,
        printAttribute(this.utils.stringify, name, expectedValue),
        "Received",
        receivedAttribute
      );
    }
  };
}

// src/to-have-class.js
function getExpectedClassNamesAndOptions(params) {
  const lastParam = params.pop();
  let expectedClassNames, options;
  if (typeof lastParam === "object") {
    expectedClassNames = params;
    options = lastParam;
  } else {
    expectedClassNames = params.concat(lastParam);
    options = { exact: false };
  }
  return { expectedClassNames, options };
}
function splitClassNames(str) {
  if (!str) {
    return [];
  }
  return str.split(/\s+/).filter((s) => s.length > 0);
}
function isSubset(subset, superset) {
  return subset.every((item) => superset.includes(item));
}
function toHaveClass(htmlElement, ...params) {
  checkHtmlElement(htmlElement, toHaveClass, this);
  const { expectedClassNames, options } = getExpectedClassNamesAndOptions(params);
  const received = splitClassNames(htmlElement.getAttribute("class"));
  const expected = expectedClassNames.reduce(
    (acc, className) => acc.concat(splitClassNames(className)),
    []
  );
  if (options.exact) {
    return {
      pass: isSubset(expected, received) && expected.length === received.length,
      message: () => {
        const to = this.isNot ? "not to" : "to";
        return getMessage(
          this,
          this.utils.matcherHint(
            `${this.isNot ? ".not" : ""}.toHaveClass`,
            "element",
            this.utils.printExpected(expected.join(" "))
          ),
          `Expected the element ${to} have EXACTLY defined classes`,
          expected.join(" "),
          "Received",
          received.join(" ")
        );
      }
    };
  }
  return expected.length > 0 ? {
    pass: isSubset(expected, received),
    message: () => {
      const to = this.isNot ? "not to" : "to";
      return getMessage(
        this,
        this.utils.matcherHint(
          `${this.isNot ? ".not" : ""}.toHaveClass`,
          "element",
          this.utils.printExpected(expected.join(" "))
        ),
        `Expected the element ${to} have class`,
        expected.join(" "),
        "Received",
        received.join(" ")
      );
    }
  } : {
    pass: this.isNot ? received.length > 0 : false,
    message: () => this.isNot ? getMessage(
      this,
      this.utils.matcherHint(".not.toHaveClass", "element", ""),
      "Expected the element to have classes",
      "(none)",
      "Received",
      received.join(" ")
    ) : [
      this.utils.matcherHint(`.toHaveClass`, "element"),
      "At least one expected class must be provided."
    ].join("\n")
  };
}

// src/to-have-style.js
import chalk from "chalk";
function getStyleDeclaration(document, css) {
  const styles = {};
  const copy = document.createElement("div");
  Object.keys(css).forEach((property) => {
    copy.style[property] = css[property];
    styles[property] = copy.style[property];
  });
  return styles;
}
function isSubset2(styles, computedStyle) {
  return !!Object.keys(styles).length && Object.entries(styles).every(
    ([prop, value]) => computedStyle[prop] === value || computedStyle.getPropertyValue(prop.toLowerCase()) === value
  );
}
function printoutStyles(styles) {
  return Object.keys(styles).sort().map((prop) => `${prop}: ${styles[prop]};`).join("\n");
}
function expectedDiff(diffFn, expected, computedStyles) {
  const received = Array.from(computedStyles).filter((prop) => expected[prop] !== void 0).reduce(
    (obj, prop) => Object.assign(obj, { [prop]: computedStyles.getPropertyValue(prop) }),
    {}
  );
  const diffOutput = diffFn(printoutStyles(expected), printoutStyles(received));
  return diffOutput.replace(`${chalk.red("+ Received")}
`, "");
}
function toHaveStyle(htmlElement, css) {
  checkHtmlElement(htmlElement, toHaveStyle, this);
  const parsedCSS = typeof css === "object" ? css : parseCSS(css, toHaveStyle, this);
  const { getComputedStyle } = htmlElement.ownerDocument.defaultView;
  const expected = getStyleDeclaration(htmlElement.ownerDocument, parsedCSS);
  const received = getComputedStyle(htmlElement);
  return {
    pass: isSubset2(expected, received),
    message: () => {
      const matcher = `${this.isNot ? ".not" : ""}.toHaveStyle`;
      return [
        this.utils.matcherHint(matcher, "element", ""),
        expectedDiff(this.utils.diff, expected, received)
      ].join("\n\n");
    }
  };
}

// src/to-have-focus.js
function toHaveFocus(element) {
  checkHtmlElement(element, toHaveFocus, this);
  return {
    pass: element.ownerDocument.activeElement === element,
    message: () => {
      return [
        this.utils.matcherHint(
          `${this.isNot ? ".not" : ""}.toHaveFocus`,
          "element",
          ""
        ),
        "",
        ...this.isNot ? [
          "Received element is focused:",
          `  ${this.utils.printReceived(element)}`
        ] : [
          "Expected element with focus:",
          `  ${this.utils.printExpected(element)}`,
          "Received element with focus:",
          `  ${this.utils.printReceived(
            element.ownerDocument.activeElement
          )}`
        ]
      ].join("\n");
    }
  };
}

// src/to-have-form-values.ts
import escape from "css.escape";
import { isEqualWith, uniq } from "lodash-es";
function getMultiElementValue(elements) {
  const types = uniq(elements.map((element) => element.type));
  if (types.length !== 1) {
    throw new Error(
      "Multiple form elements with the same name must be of the same type"
    );
  }
  switch (types[0]) {
    case "radio": {
      const theChosenOne = elements.find((radio) => radio.checked);
      return theChosenOne ? theChosenOne.value : void 0;
    }
    case "checkbox":
      return elements.filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.value);
    default:
      return elements.map((element) => element.value);
  }
}
function getFormValue(container, name) {
  container.elements;
  const elements = [
    ...container.querySelectorAll(`[name="${escape(name)}"]`)
  ];
  if (elements.length === 0) {
    return void 0;
  }
  switch (elements.length) {
    case 1:
      return getSingleElementValue(elements[0]);
    default:
      return getMultiElementValue(elements);
  }
}
function getPureName(name) {
  return /\[\]$/.test(name) ? name.slice(0, -2) : name;
}
function getAllFormValues(container) {
  const names = Array.from(container.elements).map(
    (element) => element.name
  );
  return names.reduce(
    (obj, name) => ({
      ...obj,
      [getPureName(name)]: getFormValue(container, name)
    }),
    {}
  );
}
function toHaveFormValues(formElement, expectedValues) {
  checkHtmlElement(formElement, toHaveFormValues, this);
  if (!formElement.elements) {
    throw new Error("toHaveFormValues must be called on a form or a fieldset");
  }
  const formValues = getAllFormValues(formElement);
  return {
    pass: Object.entries(expectedValues).every(
      ([name, expectedValue]) => isEqualWith(formValues[name], expectedValue, compareArraysAsSet)
    ),
    message: () => {
      const to = this.isNot ? "not to" : "to";
      const matcher = `${this.isNot ? ".not" : ""}.toHaveFormValues`;
      const commonKeyValues = Object.keys(formValues).filter((key) => expectedValues.hasOwnProperty(key)).reduce((obj, key) => ({ ...obj, [key]: formValues[key] }), {});
      return [
        this.utils.matcherHint(matcher, "element", ""),
        `Expected the element ${to} have form values`,
        this.utils.diff(expectedValues, commonKeyValues)
      ].join("\n\n");
    }
  };
}

// src/to-be-visible.js
function isStyleVisible(element) {
  const { getComputedStyle } = element.ownerDocument.defaultView;
  const { display: display2, visibility, opacity } = getComputedStyle(element);
  return display2 !== "none" && visibility !== "hidden" && visibility !== "collapse" && opacity !== "0" && opacity !== 0;
}
function isAttributeVisible(element, previousElement) {
  let detailsVisibility;
  if (previousElement) {
    detailsVisibility = element.nodeName === "DETAILS" && previousElement.nodeName !== "SUMMARY" ? element.hasAttribute("open") : true;
  } else {
    detailsVisibility = element.nodeName === "DETAILS" ? element.hasAttribute("open") : true;
  }
  return !element.hasAttribute("hidden") && detailsVisibility;
}
function isElementVisible(element, previousElement) {
  return isStyleVisible(element) && isAttributeVisible(element, previousElement) && (!element.parentElement || isElementVisible(element.parentElement, element));
}
function toBeVisible(element) {
  checkHtmlElement(element, toBeVisible, this);
  const isInDocument = element.ownerDocument === element.getRootNode({ composed: true });
  const isVisible = isInDocument && isElementVisible(element);
  return {
    pass: isVisible,
    message: () => {
      const is = isVisible ? "is" : "is not";
      return [
        this.utils.matcherHint(
          `${this.isNot ? ".not" : ""}.toBeVisible`,
          "element",
          ""
        ),
        "",
        `Received element ${is} visible${isInDocument ? "" : " (element is not in the document)"}:`,
        `  ${this.utils.printReceived(element.cloneNode(false))}`
      ].join("\n");
    }
  };
}

// src/to-be-disabled.js
var FORM_TAGS = [
  "fieldset",
  "input",
  "select",
  "optgroup",
  "option",
  "button",
  "textarea"
];
function isFirstLegendChildOfFieldset(element, parent) {
  return getTag(element) === "legend" && getTag(parent) === "fieldset" && element.isSameNode(
    Array.from(parent.children).find((child) => getTag(child) === "legend")
  );
}
function isElementDisabledByParent(element, parent) {
  return isElementDisabled(parent) && !isFirstLegendChildOfFieldset(element, parent);
}
function isCustomElement(tag) {
  return tag.includes("-");
}
function canElementBeDisabled(element) {
  const tag = getTag(element);
  return FORM_TAGS.includes(tag) || isCustomElement(tag);
}
function isElementDisabled(element) {
  return canElementBeDisabled(element) && element.hasAttribute("disabled");
}
function isAncestorDisabled(element) {
  const parent = element.parentElement;
  return Boolean(parent) && (isElementDisabledByParent(element, parent) || isAncestorDisabled(parent));
}
function isElementOrAncestorDisabled(element) {
  return canElementBeDisabled(element) && (isElementDisabled(element) || isAncestorDisabled(element));
}
function toBeDisabled(element) {
  checkHtmlElement(element, toBeDisabled, this);
  const isDisabled = isElementOrAncestorDisabled(element);
  return {
    pass: isDisabled,
    message: () => {
      const is = isDisabled ? "is" : "is not";
      return [
        this.utils.matcherHint(
          `${this.isNot ? ".not" : ""}.toBeDisabled`,
          "element",
          ""
        ),
        "",
        `Received element ${is} disabled:`,
        `  ${this.utils.printReceived(element.cloneNode(false))}`
      ].join("\n");
    }
  };
}
function toBeEnabled(element) {
  checkHtmlElement(element, toBeEnabled, this);
  const isEnabled = !isElementOrAncestorDisabled(element);
  return {
    pass: isEnabled,
    message: () => {
      const is = isEnabled ? "is" : "is not";
      return [
        this.utils.matcherHint(
          `${this.isNot ? ".not" : ""}.toBeEnabled`,
          "element",
          ""
        ),
        "",
        `Received element ${is} enabled:`,
        `  ${this.utils.printReceived(element.cloneNode(false))}`
      ].join("\n");
    }
  };
}

// src/to-be-required.js
var FORM_TAGS2 = ["select", "textarea"];
var ARIA_FORM_TAGS = ["input", "select", "textarea"];
var UNSUPPORTED_INPUT_TYPES = [
  "color",
  "hidden",
  "range",
  "submit",
  "image",
  "reset"
];
var SUPPORTED_ARIA_ROLES = [
  "combobox",
  "gridcell",
  "radiogroup",
  "spinbutton",
  "tree"
];
function isRequiredOnFormTagsExceptInput(element) {
  return FORM_TAGS2.includes(getTag(element)) && element.hasAttribute("required");
}
function isRequiredOnSupportedInput(element) {
  return getTag(element) === "input" && element.hasAttribute("required") && (element.hasAttribute("type") && !UNSUPPORTED_INPUT_TYPES.includes(element.getAttribute("type")) || !element.hasAttribute("type"));
}
function isElementRequiredByARIA(element) {
  return element.hasAttribute("aria-required") && element.getAttribute("aria-required") === "true" && (ARIA_FORM_TAGS.includes(getTag(element)) || element.hasAttribute("role") && SUPPORTED_ARIA_ROLES.includes(element.getAttribute("role")));
}
function toBeRequired(element) {
  checkHtmlElement(element, toBeRequired, this);
  const isRequired = isRequiredOnFormTagsExceptInput(element) || isRequiredOnSupportedInput(element) || isElementRequiredByARIA(element);
  return {
    pass: isRequired,
    message: () => {
      const is = isRequired ? "is" : "is not";
      return [
        this.utils.matcherHint(
          `${this.isNot ? ".not" : ""}.toBeRequired`,
          "element",
          ""
        ),
        "",
        `Received element ${is} required:`,
        `  ${this.utils.printReceived(element.cloneNode(false))}`
      ].join("\n");
    }
  };
}

// src/to-be-invalid.js
var FORM_TAGS3 = ["form", "input", "select", "textarea"];
function isElementHavingAriaInvalid(element) {
  return element.hasAttribute("aria-invalid") && element.getAttribute("aria-invalid") !== "false";
}
function isSupportsValidityMethod(element) {
  return FORM_TAGS3.includes(getTag(element));
}
function isElementInvalid(element) {
  const isHaveAriaInvalid = isElementHavingAriaInvalid(element);
  if (isSupportsValidityMethod(element)) {
    return isHaveAriaInvalid || !element.checkValidity();
  } else {
    return isHaveAriaInvalid;
  }
}
function toBeInvalid(element) {
  checkHtmlElement(element, toBeInvalid, this);
  const isInvalid = isElementInvalid(element);
  return {
    pass: isInvalid,
    message: () => {
      const is = isInvalid ? "is" : "is not";
      return [
        this.utils.matcherHint(
          `${this.isNot ? ".not" : ""}.toBeInvalid`,
          "element",
          ""
        ),
        "",
        `Received element ${is} currently invalid:`,
        `  ${this.utils.printReceived(element.cloneNode(false))}`
      ].join("\n");
    }
  };
}
function toBeValid(element) {
  checkHtmlElement(element, toBeValid, this);
  const isValid = !isElementInvalid(element);
  return {
    pass: isValid,
    message: () => {
      const is = isValid ? "is" : "is not";
      return [
        this.utils.matcherHint(
          `${this.isNot ? ".not" : ""}.toBeValid`,
          "element",
          ""
        ),
        "",
        `Received element ${is} currently valid:`,
        `  ${this.utils.printReceived(element.cloneNode(false))}`
      ].join("\n");
    }
  };
}

// src/to-have-value.js
import { isEqualWith as isEqualWith2 } from "lodash-es";
function toHaveValue(htmlElement, expectedValue) {
  checkHtmlElement(htmlElement, toHaveValue, this);
  if (htmlElement.tagName.toLowerCase() === "input" && ["checkbox", "radio"].includes(htmlElement.type)) {
    throw new Error(
      "input with type=checkbox or type=radio cannot be used with .toHaveValue(). Use .toBeChecked() for type=checkbox or .toHaveFormValues() instead"
    );
  }
  const receivedValue = getSingleElementValue(htmlElement);
  const expectsValue = expectedValue !== void 0;
  let expectedTypedValue = expectedValue;
  let receivedTypedValue = receivedValue;
  if (expectedValue == receivedValue && expectedValue !== receivedValue) {
    expectedTypedValue = `${expectedValue} (${typeof expectedValue})`;
    receivedTypedValue = `${receivedValue} (${typeof receivedValue})`;
  }
  return {
    pass: expectsValue ? isEqualWith2(receivedValue, expectedValue, compareArraysAsSet) : Boolean(receivedValue),
    message: () => {
      const to = this.isNot ? "not to" : "to";
      const matcher = this.utils.matcherHint(
        `${this.isNot ? ".not" : ""}.toHaveValue`,
        "element",
        expectedValue
      );
      return getMessage(
        this,
        matcher,
        `Expected the element ${to} have value`,
        expectsValue ? expectedTypedValue : "(any)",
        "Received",
        receivedTypedValue
      );
    }
  };
}

// src/to-have-display-value.js
function toHaveDisplayValue(htmlElement, expectedValue) {
  checkHtmlElement(htmlElement, toHaveDisplayValue, this);
  const tagName = htmlElement.tagName.toLowerCase();
  if (!["select", "input", "textarea"].includes(tagName)) {
    throw new Error(
      ".toHaveDisplayValue() currently supports only input, textarea or select elements, try with another matcher instead."
    );
  }
  if (tagName === "input" && ["radio", "checkbox"].includes(htmlElement.type)) {
    throw new Error(
      `.toHaveDisplayValue() currently does not support input[type="${htmlElement.type}"], try with another matcher instead.`
    );
  }
  const values = getValues(tagName, htmlElement);
  const expectedValues = getExpectedValues(expectedValue);
  const numberOfMatchesWithValues = expectedValues.filter(
    (expected) => values.some(
      (value) => expected instanceof RegExp ? expected.test(value) : this.equals(value, String(expected))
    )
  ).length;
  const matchedWithAllValues = numberOfMatchesWithValues === values.length;
  const matchedWithAllExpectedValues = numberOfMatchesWithValues === expectedValues.length;
  return {
    pass: matchedWithAllValues && matchedWithAllExpectedValues,
    message: () => getMessage(
      this,
      this.utils.matcherHint(
        `${this.isNot ? ".not" : ""}.toHaveDisplayValue`,
        "element",
        ""
      ),
      `Expected element ${this.isNot ? "not " : ""}to have display value`,
      expectedValue,
      "Received",
      values
    )
  };
}
function getValues(tagName, htmlElement) {
  return tagName === "select" ? Array.from(htmlElement).filter((option) => option.selected).map((option) => option.textContent) : [htmlElement.value];
}
function getExpectedValues(expectedValue) {
  return expectedValue instanceof Array ? expectedValue : [expectedValue];
}

// src/to-be-checked.js
import { createRequire } from "module";
var require2 = createRequire(import.meta.url);
var { roles } = require2("aria-query");
function toBeChecked(element) {
  checkHtmlElement(element, toBeChecked, this);
  const isValidInput = () => {
    return element.tagName.toLowerCase() === "input" && ["checkbox", "radio"].includes(element.type);
  };
  const isValidAriaElement = () => {
    return roleSupportsChecked(element.getAttribute("role")) && ["true", "false"].includes(element.getAttribute("aria-checked"));
  };
  if (!isValidInput() && !isValidAriaElement()) {
    return {
      pass: false,
      message: () => `only inputs with type="checkbox" or type="radio" or elements with ${supportedRolesSentence()} and a valid aria-checked attribute can be used with .toBeChecked(). Use .toHaveValue() instead`
    };
  }
  const isChecked = () => {
    if (isValidInput())
      return element.checked;
    return element.getAttribute("aria-checked") === "true";
  };
  return {
    pass: isChecked(),
    message: () => {
      const is = isChecked() ? "is" : "is not";
      return [
        this.utils.matcherHint(
          `${this.isNot ? ".not" : ""}.toBeChecked`,
          "element",
          ""
        ),
        "",
        `Received element ${is} checked:`,
        `  ${this.utils.printReceived(element.cloneNode(false))}`
      ].join("\n");
    }
  };
}
function supportedRolesSentence() {
  return toSentence(
    supportedRoles().map((role) => `role="${role}"`),
    { lastWordConnector: " or " }
  );
}
function supportedRoles() {
  return roles.keys().filter(roleSupportsChecked);
}
function roleSupportsChecked(role) {
  return roles.get(role)?.props["aria-checked"] !== void 0;
}

// src/to-be-partially-checked.js
function toBePartiallyChecked(element) {
  checkHtmlElement(element, toBePartiallyChecked, this);
  const isValidInput = () => {
    return element.tagName.toLowerCase() === "input" && element.type === "checkbox";
  };
  const isValidAriaElement = () => {
    return element.getAttribute("role") === "checkbox";
  };
  if (!isValidInput() && !isValidAriaElement()) {
    return {
      pass: false,
      message: () => 'only inputs with type="checkbox" or elements with role="checkbox" and a valid aria-checked attribute can be used with .toBePartiallyChecked(). Use .toHaveValue() instead'
    };
  }
  const isPartiallyChecked = () => {
    const isAriaMixed = element.getAttribute("aria-checked") === "mixed";
    if (isValidInput()) {
      return element.indeterminate || isAriaMixed;
    }
    return isAriaMixed;
  };
  return {
    pass: isPartiallyChecked(),
    message: () => {
      const is = isPartiallyChecked() ? "is" : "is not";
      return [
        this.utils.matcherHint(
          `${this.isNot ? ".not" : ""}.toBePartiallyChecked`,
          "element",
          ""
        ),
        "",
        `Received element ${is} partially checked:`,
        `  ${this.utils.printReceived(element.cloneNode(false))}`
      ].join("\n");
    }
  };
}

// src/to-have-description.js
function toHaveDescription(htmlElement, checkWith) {
  deprecate("toHaveDescription", "Please use toHaveAccessibleDescription.");
  checkHtmlElement(htmlElement, toHaveDescription, this);
  const expectsDescription = checkWith !== void 0;
  const descriptionIDRaw = htmlElement.getAttribute("aria-describedby") || "";
  const descriptionIDs = descriptionIDRaw.split(/\s+/).filter(Boolean);
  let description = "";
  if (descriptionIDs.length > 0) {
    const document = htmlElement.ownerDocument;
    const descriptionEls = descriptionIDs.map((descriptionID) => document.getElementById(descriptionID)).filter(Boolean);
    description = normalize(
      descriptionEls.map((el) => el.textContent).join(" ")
    );
  }
  return {
    pass: expectsDescription ? checkWith instanceof RegExp ? checkWith.test(description) : this.equals(description, checkWith) : Boolean(description),
    message: () => {
      const to = this.isNot ? "not to" : "to";
      return getMessage(
        this,
        this.utils.matcherHint(
          `${this.isNot ? ".not" : ""}.toHaveDescription`,
          "element",
          ""
        ),
        `Expected the element ${to} have description`,
        this.utils.printExpected(checkWith),
        "Received",
        this.utils.printReceived(description)
      );
    }
  };
}

// src/to-have-errormessage.js
function toHaveErrorMessage(htmlElement, checkWith) {
  checkHtmlElement(htmlElement, toHaveErrorMessage, this);
  if (!htmlElement.hasAttribute("aria-invalid") || htmlElement.getAttribute("aria-invalid") === "false") {
    const not = this.isNot ? ".not" : "";
    return {
      pass: false,
      message: () => {
        return getMessage(
          this,
          this.utils.matcherHint(`${not}.toHaveErrorMessage`, "element", ""),
          `Expected the element to have invalid state indicated by`,
          'aria-invalid="true"',
          "Received",
          htmlElement.hasAttribute("aria-invalid") ? `aria-invalid="${htmlElement.getAttribute("aria-invalid")}"` : this.utils.printReceived("")
        );
      }
    };
  }
  const expectsErrorMessage = checkWith !== void 0;
  const errormessageIDRaw = htmlElement.getAttribute("aria-errormessage") || "";
  const errormessageIDs = errormessageIDRaw.split(/\s+/).filter(Boolean);
  let errormessage = "";
  if (errormessageIDs.length > 0) {
    const document = htmlElement.ownerDocument;
    const errormessageEls = errormessageIDs.map((errormessageID) => document.getElementById(errormessageID)).filter(Boolean);
    errormessage = normalize(
      errormessageEls.map((el) => el.textContent).join(" ")
    );
  }
  return {
    pass: expectsErrorMessage ? checkWith instanceof RegExp ? checkWith.test(errormessage) : this.equals(errormessage, checkWith) : Boolean(errormessage),
    message: () => {
      const to = this.isNot ? "not to" : "to";
      return getMessage(
        this,
        this.utils.matcherHint(
          `${this.isNot ? ".not" : ""}.toHaveErrorMessage`,
          "element",
          ""
        ),
        `Expected the element ${to} have error message`,
        this.utils.printExpected(checkWith),
        "Received",
        this.utils.printReceived(errormessage)
      );
    }
  };
}

export {
  toBeInTheDOM,
  toBeInTheDocument,
  toBeEmpty,
  toBeEmptyDOMElement,
  toContainElement,
  toContainHTML,
  toHaveTextContent,
  toHaveAccessibleDescription,
  toHaveAccessibleName,
  toHaveAttribute,
  toHaveClass,
  toHaveStyle,
  toHaveFocus,
  toHaveFormValues,
  toBeVisible,
  toBeDisabled,
  toBeEnabled,
  toBeRequired,
  toBeInvalid,
  toBeValid,
  toHaveValue,
  toHaveDisplayValue,
  toBeChecked,
  toBePartiallyChecked,
  toHaveDescription,
  toHaveErrorMessage,
  matchers_exports
};
