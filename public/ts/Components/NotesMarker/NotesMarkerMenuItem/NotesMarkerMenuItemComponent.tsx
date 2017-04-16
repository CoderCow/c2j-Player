import { GoToPositionButtonComponent, IGoToPositionButtonOptions } from './GoToPositionButton';
import { CopyToClipboardButtonComponent, ICopyToClipboardButtonOptions } from './CopyToClipboardButton';
import { INotesMarkerMenuItemOptions } from './INotesMarkerMenuItemOptions';
import vtreeToDomElement = require('virtual-dom/create-element');
import h = require('virtual-dom/h');

/** A menu item of a note marker menu. */
export class NotesMarkerMenuItemComponent extends VideoJSMenuItem {
	/** Initializes a new instance of this class. */
	public constructor(player: VideoJSPlayer, options: INotesMarkerMenuItemOptions) {
		super(player, { cjOptions: options });

		var $el = $(this.el());
		var noteButtons = $el.find('.note-buttons');
		
		var elementToCopy = $el.find('.note-content')[0];
		var copyButton = new CopyToClipboardButtonComponent(this.player_, { elementToCopy });
		this.addChild(copyButton);
		noteButtons.append(copyButton.el());

		new GoToPositionButtonComponent(this.player_, {
			el: $(this.el()).find('.note-goto-button')[0],
			goToPosition: options.note.begin
		});
	}

	/** @inheritdoc */
	public createEl(tagName: string, properties?: any, attributes?: any) {
		var title = this.cjOptions().note.title;
		var content = this.cjOptions().note.content;

		// TODO: format content like _blank on all <a>, make beautiful anchors with a symbol, convert links to <a>'s, format code etc.
		var vTree = <li className="vjs-menu-item" tabIndex="1">
			<div className="note-title">
				<div className="note-icon c2j-icon c2j-icon-file-text"></div>
				<span className="title-text">{title}</span>
				<div className="note-buttons">
					<div className="note-goto-button c2j-icon c2j-icon-play-circle" title={this.localize('Go to this Position')} tabIndex="1" data-closemenu="true"></div>
				</div>
			</div>
			<div className="note-content">
				{/* Content can contain p, b, i, span elements (as provided by Camtasia2Json)*/}
				{h('div', { className: "note-content", innerHTML: content } as any)}
			</div>
		</li>;

		return vtreeToDomElement(vTree);
	}

	/** @inheritdoc */
	public handleClick(event: Event) {
		event.stopPropagation();
	}

	public cjOptions(): INotesMarkerMenuItemOptions {
		return this.options_.cjOptions;
	}
}

videojs.registerComponent('NotesMarkerMenuItemComponent', NotesMarkerMenuItemComponent);
