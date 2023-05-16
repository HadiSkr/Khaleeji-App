import { NgModule } from '@angular/core';
import { VanishScrollDirective } from './vanish-scroll/vanish-scroll';
import { VanishScrollFooterDirective } from './vanish-scroll-footer/vanish-scroll-footer';
@NgModule({
	declarations: [VanishScrollDirective,
    VanishScrollFooterDirective],
	imports: [],
	exports: [VanishScrollDirective,
    VanishScrollFooterDirective]
})
export class DirectivesModule {}
