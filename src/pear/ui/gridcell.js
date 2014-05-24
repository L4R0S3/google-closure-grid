goog.provide('pear.ui.GridCell');

goog.require('pear.ui.Cell');


/**
 * GridCell
 * 
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
 *     document interaction.
 * @constructor
 * @extends {pear.ui.Cell}
 */
pear.ui.GridCell = function(opt_domHelper) {
  pear.ui.Cell.call(this,opt_domHelper);
};
goog.inherits(pear.ui.GridCell, pear.ui.Cell);


/**
 * Element to hold content
 * @type {Element}
 */
pear.ui.GridCell.prototype.contentElement_ = null;

/**
 * Default CSS class to be applied to the root element of cell
 * @type {string}
 */
pear.ui.GridCell.CSS_CLASS =
    goog.getCssName('pear-grid-cell-data');

/**
 * set Content Element 
 * @param {Element} element [description]
 */
pear.ui.GridCell.prototype.setContentElement = function(element){
  this.contentElement_=element;
};

/**
 * get Content Element
 * @return {Element}         [description]
 */
pear.ui.GridCell.prototype.getContentElement = function(){
  return this.contentElement_;
};


/**
 * Get Cell Data
 * @return {*} data
 */
pear.ui.GridCell.prototype.getCellData = function() {
  var rowview = this.getRow().getDataRowView();
  var model = rowview.getRowData();
  return model[this.getDataColumn().getDataField()];
};

/**
 * Returns the text caption or DOM structure displayed in the component.
 * @return {goog.ui.ControlContent} Text caption or DOM structure
 *     comprising the component's contents.
 */
pear.ui.GridCell.prototype.getContent = function() {
  
  return String(this.getCellData());
};

/**
 * Returns the text caption or DOM structure displayed in the component.
 * @public
 */
pear.ui.GridCell.prototype.applyFormatting = function() {
  var columnObject = this.getDataColumn();
  var formatter = columnObject.getColumnFormatter();
  var handler = formatter.handler || this;
  if (formatter && formatter.fn){
    formatter.fn.call(handler,this);
  }
};

/**
 * [setHighlight description]
 * @param {boolean} highlight
 */
pear.ui.GridCell.prototype.setHighlight = function(highlight) {
  if (highlight) {
    goog.dom.classes.add(this.getElement(), pear.ui.GridCell.CSS_CLASS+'-highlight');
    this.highlighted_ = true;
  }else {
    goog.dom.classes.remove(this.getElement(),  pear.ui.GridCell.CSS_CLASS+'-highlight');
    this.highlighted_ = false;
  }
};

/**
 * Configures the component after its DOM has been rendered, and sets up event
 * handling.  Overrides {@link goog.ui.Component#enterDocument}.
 * @override
 */
pear.ui.GridCell.prototype.enterDocument = function() {
  pear.ui.GridCell.superClass_.enterDocument.call(this);

  goog.dom.classes.add(this.getElement(), pear.ui.GridCell.CSS_CLASS);
  goog.dom.classes.add(this.getElement(), 'col'+this.getCellIndex());

  this.createContentElement();
  
  // Set Size of Content Element
  this.applyFormatting();
};


/**
 * Remove Content Element
 */
pear.ui.GridCell.prototype.removeContent = function() {
  goog.dom.removeNode(this.contentElement_);
};

/**
 * Create Content Element
 */
pear.ui.GridCell.prototype.createContentElement = function() {
  var cellElement = this.getDomHelper().createDom(
      'div', ' '+goog.getCssName(pear.ui.GridCell.CSS_CLASS,'content')+'  overflowhidden', this.getContent());

  var align = this.getDataColumn().getAlign();
  var aligncss = (align === pear.data.Column.Align.LEFT)? 
      goog.getCssName(pear.ui.GridCell.CSS_CLASS,'left'):
      goog.getCssName(pear.ui.GridCell.CSS_CLASS,'right');

  goog.dom.classes.add(cellElement, aligncss);
  this.getDomHelper().appendChild(this.getElement(),cellElement);

  this.setContentElement(cellElement);
};


/**
 * [disposeInternal description]
 * @inheritDoc
 */
pear.ui.GridCell.prototype.disposeInternal = function() {
  pear.ui.GridCell.superClass_.disposeInternal.call(this);
};
