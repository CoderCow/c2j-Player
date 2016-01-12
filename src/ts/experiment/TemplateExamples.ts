module Player {
	'use strict';
	export class TemplateExamples {
		public static all() {
			TemplateExamples.simple();
			TemplateExamples.section();
			TemplateExamples.list();
			TemplateExamples.simpleConditionals();
			TemplateExamples.advancedConditionals();
			TemplateExamples.partials();
		}

		public static simple() {
			TemplateUtils.render('examples/SimpleExample', { name: 'Foo', location: 'bar' }, (out: string) => {
				$('#templateTestOutput').after(out);
			});
		}

		public static section() {
			var context: any = {
				outerText: 'foo1',
				outerText2: 'foo1',
				inner: {
					innerText: 'bar1',
					innerText2: 'bar2'
				}
			};

			TemplateUtils.render('examples/SectionExample', context, (out: string) => {
				$('#templateTestOutput').after(out);
			});
		}

		public static list() {
			var context: any = {
				items: [
					{ item: 'Foo' },
					{ item: 'Bar' },
					{ item: 'Rab' },
					{ item: 'Oof' }
				]
			};

			TemplateUtils.render('examples/ListExample', context, (out: string) => {
				$('#templateTestOutput').after(out);
			});
		}

		public static simpleConditionals() {
			TemplateUtils.render('examples/SimpleConditionalsExample', { "appStatusOK": true }, (out: string) => {
				$('#templateTestOutput').after(out);
			});
		}

		public static advancedConditionals() {
			var data: any = {
				"gears": {
					"status": "OK",
					"error": false
				},
					"engine": {
					"status": "OK",
					"error": false,
					"oilLevel": 0.5,
					"temperature": 80
				},
				"appStatusOK": function(chunk: DustChunk, context: DustContext, bodies: any, params: any): any {
					var contextData: any = this;

					if (contextData.gears.error)
						return chunk.render(bodies['gearsError'], context);
					else if(contextData.engine.error)
						return chunk.render(bodies['engineError'], context);
					else if (contextData.engine.oilLevel < 0.7)
						return chunk.render(bodies['oilLevelError'], context);
					else
						return true;
				}
			};

			TemplateUtils.render('examples/AdvancedConditionalsExample', data, (out: string) => {
				$('#templateTestOutput').after(out);
			});
		}

		public static partials() {
			TemplateUtils.render('examples/PartialsExample', { location: 'LocationSetInCode!' }, (out: string) => {
				$('#templateTestOutput').after(out);
			});
		}
	}
}