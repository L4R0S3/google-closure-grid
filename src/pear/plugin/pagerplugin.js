goog.provide('pear.plugin.Pager');

goog.require('goog.ui.Component');
goog.require('goog.events.Event');
goog.require('goog.ui.ComboBox');
goog.require('pear.ui.Plugable');



/**
 * Pager - Pager Navigation and Pager Dropdown Plugin
 *
 * @constructor
 * @extends {goog.ui.Container}
 * @param {pear.ui.Grid} grid
 * @param {number} height
 * @param {?goog.ui.Container.Orientation=} opt_orientation Container
 *     orientation; defaults to {@code VERTICAL}.
 * @param {goog.ui.ContainerRenderer=} opt_renderer Renderer used to render or
 *     decorate the container; defaults to {@link goog.ui.ContainerRenderer}.
 * @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for document
 *     interaction.
 */
pear.plugin.Pager = function(grid,opt_renderer,opt_domHelper) {
  goog.ui.Component.call(this,opt_renderer || pear.ui.RowRenderer.getInstance(),
                          opt_domHelper);
};
goog.inherits(pear.plugin.Pager, goog.ui.Component);
pear.ui.Plugable.addImplementation(pear.plugin.Pager);

/**
 * 
 */
pear.plugin.Pager.prototype.getPageIndex = function() {
  return this.getGrid().getPageIndex();
};

pear.plugin.Pager.prototype.getGrid = function() {
  return this.grid_;
};

pear.plugin.Pager.prototype.show = function(grid){
  this.grid_ = grid;
  var parentElem = grid.getElement();
  if (this.grid_.getConfiguration().AllowPaging){
    var footer = goog.dom.getNextElementSibling(grid.getElement());
    if ( footer && goog.dom.classes.has(footer, 'pear-grid-footer')){

    }else{
      footer = goog.dom.createDom('div', 'pear-grid-footer');
      goog.dom.insertSiblingAfter(footer,parentElem);
    }
    this.render(footer);
  }
}

/**
 * @override
 */
pear.plugin.Pager.prototype.createDom = function() {
  this.element_ = goog.dom.createDom('div', 'pear-grid-pager');
};

pear.plugin.Pager.prototype.disposeInternal = function() {
  if (this.grid_.getConfiguration().AllowPaging){
    this.pagerComboBox_.dispose();
    this.pagerComboBox_=null;
  }
  this.grid_= null;
  pear.plugin.Pager.superClass_.disposeInternal.call(this);
};


/**
 * @override
 *
 */
pear.plugin.Pager.prototype.enterDocument = function() {
  pear.plugin.Pager.superClass_.enterDocument.call(this);
  
  var elem = this.getElement();
  //this.setPosition_();
  //goog.style.setSize(elem,pear.ui.Grid.Configuration.RowHeight);
  this.createPager_();
};


/**
 * @private
 *
 */
pear.plugin.Pager.prototype.createPager_ = function() {
  this.createPagerNavControls_();
  this.createPagerDropDown_();
};

pear.plugin.Pager.prototype.createPagerDropDown_ = function() {
  var elem = this.getElement();
  var grid = this.getGrid();
  var rowsPerPage = grid.getConfiguration().PageSize;
  var totalRows = grid.getRowCount();

  this.pagerComboBox_ = new goog.ui.ComboBox();
  this.pagerComboBox_.setUseDropdownArrow(true);
  this.pagerComboBox_.setDefaultText('Page');

  var caption = new goog.ui.ComboBoxItem('Page');
  caption.setSticky(true);
  caption.setEnabled(false);
  this.pagerComboBox_.addItem(caption);
  var i=0;
  do {
    this.pagerComboBox_.addItem(new goog.ui.ComboBoxItem(goog.string.buildString(i+1)));
    i++;
  }while (i*rowsPerPage < totalRows)
  this.pagerComboBox_.render(this.getElement()); 
  goog.style.setWidth(this.pagerComboBox_.getInputElement(),30);
  goog.style.setHeight(this.pagerComboBox_.getMenu().getElement(),150);
  this.pagerComboBox_.getMenu().getElement().style.overflowY = 'auto';

  this.getHandler().
      listen(this.pagerComboBox_,goog.ui.Component.EventType.CHANGE,this.handleChange_,false,this);
};

pear.plugin.Pager.prototype.createPagerNavControls_ = function() {
  var elem = this.getElement();
  var grid = this.getGrid();
  var rowsPerPage = grid.getConfiguration().PageSize;
  var totalRows = grid.getRowCount();
  
  var prev = new goog.ui.Control(
        goog.dom.createDom('span',"fa fa-chevron-left"),
        pear.plugin.PagerCellRenderer.getInstance());
  prev.render(elem);

  var next = new goog.ui.Control(
        goog.dom.createDom('span',"fa fa-chevron-right"),
        pear.plugin.PagerCellRenderer.getInstance());
  next.render(elem);

  this.navControl_ = [prev,next];

  goog.array.forEach(this.navControl_,function(value){
    value.setHandleMouseEvents(true);
    this.getHandler().
      listen(value,goog.ui.Component.EventType.ACTION,this.handleAction_,false,this);
  },this);
};

pear.plugin.Pager.prototype.handleAction_ = function (ge){
  var pageIndex = this.getPageIndex();

  if (ge.target === this.navControl_[0]){
    // Prev
    pageIndex--;
    this.changePageIndex_(pageIndex);
  }else if (ge.target === this.navControl_[1]){
    // Next
    pageIndex++;
    this.changePageIndex_(pageIndex);
  }
  ge.stopPropagation();
};

pear.plugin.Pager.prototype.changePageIndex_ = function (index){
  // TODO : check for boundary 
  this.pagerComboBox_.setValue(index);
};


pear.plugin.Pager.prototype.handleChange_ = function (ge){
  var grid = this.getGrid();
  grid.setPageIndex(parseInt(this.pagerComboBox_.getValue()));
};



goog.provide('pear.plugin.PagerCellRenderer');

goog.require('goog.ui.Component');
goog.require('goog.ui.ControlRenderer');



/**
  @constructor
  @extends {goog.ui.ControlRenderer}
*/
pear.plugin.PagerCellRenderer = function() {
  goog.ui.ControlRenderer.call(this);
};
goog.inherits(pear.plugin.PagerCellRenderer, goog.ui.ControlRenderer);
goog.addSingletonGetter(pear.plugin.PagerCellRenderer);


/**
 * Default CSS class to be applied to the root element of components rendered
 * by this renderer.
 * @type {string}
 */
pear.plugin.PagerCellRenderer.CSS_CLASS = goog.getCssName('pear-grid-pager-cell');


/**
 * Returns the CSS class name to be applied to the root element of all
 * components rendered or decorated using this renderer.  The class name
 * is expected to uniquely identify the renderer class, i.e. no two
 * renderer classes are expected to share the same CSS class name.
 * @return {string} Renderer-specific CSS class name.
 */
pear.plugin.PagerCellRenderer.prototype.getCssClass = function() {
  return pear.plugin.PagerCellRenderer.CSS_CLASS;
};


/**
 * Returns the control's contents wrapped in a DIV, with the renderer's own
 * CSS class and additional state-specific classes applied to it.
 * @param {goog.ui.Control} cellControl Control to render.
 * @return {Element} Root element for the cell control.
 */
pear.plugin.PagerCellRenderer.prototype.createDom = function(cellControl) {
  // Create and return DIV wrapping contents.
  var element = cellControl.getDomHelper().createDom(
      'div', this.getClassNames(cellControl).join(' '), cellControl.getContent());

  this.setAriaStates(cellControl, element);
  return element;
};



