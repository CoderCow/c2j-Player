import { IGoToPositionButtonComponentOptions } from './../Buttons/IGoToPositionButtonComponentOptions';
import { GoToPositionButtonComponent } from './../Buttons/GoToPositionButtonComponent';
import { CopyToClipboardButtonComponent } from './../Buttons/CopyToClipboardButtonComponent';
import { ICopyToClipboardButtonComponentOptions } from './../Buttons/ICopyToClipboardButtonComponentOptions';
import { INotesMarkerMenuItemComponentOptions } from './INotesMarkerMenuItemComponentOptions';
import vtreeToDomElement = require('virtual-dom/create-element');
import h = require('virtual-dom/h');

/** A menu item of a note marker menu. */
export class NotesMarkerMenuItemComponent extends VideoJSMenuItem {
	/** Initializes a new instance of this class. */
	public constructor(player: VideoJSPlayer, options: INotesMarkerMenuItemComponentOptions) {
		super(player, { cjOptions: options });

		var elementToCopy = $(this.el()).find('.note-content')[0];
		new CopyToClipboardButtonComponent(this.player_, {
			el: $(this.el()).find('.note-copy-button')[0],
			elementToCopy: elementToCopy
		});

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
					{/* The copy button will get class 'vjs-hidden', if the Clipboard API is not available.
					    It will also get the 'copy-failed' or 'copy-succeeded' classes accordingly. */}
					<div className="note-copy-button c2j-icon c2j-icon-clipboard" title={this.localize('Copy to Clipboard')} tabIndex="1" data-closemenu="true"></div>
				</div>
			</div>
			<div className="note-content">
				{/* Content can contain p, b, i, span elements (as provided by Camtasia2Json)*/}
				{h('div', { className: "note-content", innerHTML: content } as any)}
			</div>
		</li>;

		/*el.find('.note-goto-button').click(() => {
			this.player_.currentTime(this._note.begin);
		});

		var copyButton = el.find('.note-copy-button');
		copyButton.click(() => {
			var contentElement = $(this.el()).find('.note-content');
		});*/

		return vtreeToDomElement(vTree);
	}

	/** @inheritdoc */
	public handleClick(event: Event) {
		event.stopPropagation();
	}

	public cjOptions(): INotesMarkerMenuItemComponentOptions {
		return this.options_.cjOptions;
	}
}

videojs.registerComponent('NotesMarkerMenuItemComponent', NotesMarkerMenuItemComponent);
