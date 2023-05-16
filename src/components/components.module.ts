import { NgModule } from '@angular/core';
import { BoxComponent } from './box/box';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from '../pipes/pipes.module';
import { FilterComponent } from './filter/filter';
import { MakeComponent } from './make/make';
import { ExpandableComponent } from './expandable/expandable';
import { RectangleComponent } from './rectangle/rectangle';
import { ModelComponent } from './model/model';
import {TranslateModule} from '@ngx-translate/core';
import { DropdownComponent } from './dropdown/dropdown';


@NgModule({
	declarations: [BoxComponent,
    FilterComponent,
    MakeComponent,
    ExpandableComponent,
    RectangleComponent,
    ModelComponent,
    DropdownComponent],
	imports: [IonicModule,PipesModule,TranslateModule.forRoot()],
	exports: [BoxComponent,
	FilterComponent,
    MakeComponent,
    ExpandableComponent,
    RectangleComponent,
    ModelComponent,
    DropdownComponent],
	entryComponents: [
		FilterComponent,
        MakeComponent,
        ModelComponent,
        DropdownComponent
	  ]
})
export class ComponentsModule {}
