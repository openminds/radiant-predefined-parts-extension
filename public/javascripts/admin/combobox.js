var ComboBox = Class.create();

ComboBox.Autocompleter = Autocompleter.Local;

ComboBox.Autocompleter.prototype.onBlur = function(event) {
	if (Element.getStyle(this.update, 'display') == 'none') { return; }
	setTimeout(this.hide.bind(this), 250);
	this.hasFocus = false;
	this.active = false;
}


ComboBox.prototype = {
	initialize: function(textElement, resultsElement, array, options) {
		this.textElement = $(textElement);
        
        // the first text box inside the container
        this.textBox = $A( this.textElement.getElementsByTagName('INPUT') ).findAll( function(input) {
            return (input.getAttribute('type') == 'text');
        })[0];
	
        this.results = $(resultsElement);
        this.textBox.paddingRight = '20px';
        this.textElement.style.width = (this.textBox.offsetWidth) + 'px';
        this.textElement.style.position = 'relative';

		// we dynamically insert a SPAN that will serve as the drop-down 'arrow'
        this.arrow = new Element('span');
        Object.extend(this.arrow.style, {
            cursor: 'default',
            color: '#000',
            width: '20px',
            position: 'absolute',
            top: '0',
			right: '0px',
			textAlign: 'center',
			fontSize: 'small',
			height: (this.textElement.offsetHeight - 1) + 'px'
        });

		if (document.all) {
			this.arrow.setStyle({ padding: '2px 0 0 3px', width: '18px', height: '17px'});

		}
        this.arrow.innerHTML = '<img src="/images/admin/arrow_down.gif" style="margin-top: 9px"/>';
        this.textElement.appendChild(this.arrow);
	    this.array = array;

		this.results.style.display 	= 'none';
		
		this.events = {
			showChoices: 	    this.showChoices.bindAsEventListener(this),
			hideChoices: 	    this.hideChoices.bindAsEventListener(this),
			click:				this.click.bindAsEventListener(this),
			keyDown:			this.keyDown.bindAsEventListener(this)
		}
		
		this.autocompleter = new ComboBox.Autocompleter(this.textBox, this.results, this.array, options);
				
		Event.observe(this.arrow, 'click', this.events.click);
		Event.observe(this.textBox, 'keydown', this.events.keyDown);
	},
	
	getAllChoices: function(e) {
		var choices = this.array.collect( function(choice) { return '<li>' + choice + '</li>'; } );
		var html = '<ul>' + choices.join('') + '</ul>';
		this.autocompleter.updateChoices(html);
	},
	
	keyDown: function(e) {
		if (e.keyCode == Event.KEY_DOWN && this.choicesVisible() ) {
			this.showChoices();
		}
	},
	
	// returns boolean indicating whether the choices are displayed
	choicesVisible: function() { return (Element.getStyle(this.autocompleter.update, 'display') == 'none'); },
	
	click: function() {
		if (this.choicesVisible() ) {
			this.showChoices();
		} else {
			this.hideChoices();
		}
	},
		
	showChoices: function() {
		this.textBox.focus();
    this.autocompleter.changed = false;
    this.autocompleter.hasFocus = true;
    this.getAllChoices();
	},
	
	hideChoices: function() {
		this.autocompleter.onBlur();
	}
}