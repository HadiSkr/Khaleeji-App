import { Directive, Input, ElementRef, Renderer2, OnInit,Output,EventEmitter } from "@angular/core";
import { DomController } from "@ionic/angular";
/**
 * Generated class for the VanishScrollDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[vanish-scroll]' // Attribute selector
})
export class VanishScrollDirective  implements OnInit {
  @Input("vanish-scroll") scrollArea;
  @Output("parentFun") parentFun: EventEmitter<any> = new EventEmitter();
  private hidden: boolean = false;
  private triggerDistance: number = 20;
  constructor(private element: ElementRef,
    private renderer: Renderer2,
    private domCtrl: DomController) {

  }
  ngOnInit() {
    this.initStyles();

    this.scrollArea.ionScroll.subscribe(scrollEvent => {
      let delta = scrollEvent.deltaY;

      if (delta<0) {
        this.show();
      } else{
        this.hide();
      }
    });
  }
  initStyles() {
    this.domCtrl.write(() => {
      this.renderer.setStyle(
        this.element.nativeElement,
        "transition",
        "0.2s linear"
      );
    });
  }

  hide() {
    this.domCtrl.write(() => {
      this.renderer.setStyle(this.element.nativeElement, "min-height", "0px");
      this.renderer.setStyle(this.element.nativeElement, "height", "0px");
      this.renderer.setStyle(this.element.nativeElement, "opacity", "0");
      this.renderer.setStyle(this.element.nativeElement, "padding", "0");
    });
    if(this.hidden==false)
    {
      this.parentFun.emit();
    }
    this.hidden = true;
  }

  show() {
    this.domCtrl.write(() => {
      this.renderer.setStyle(this.element.nativeElement, "height", "44px");
      this.renderer.removeStyle(this.element.nativeElement, "opacity");
      this.renderer.removeStyle(this.element.nativeElement, "min-height");
      this.renderer.removeStyle(this.element.nativeElement, "padding");
    });
    if(this.hidden==true)
    {
      this.parentFun.emit();
    }
    this.hidden = false;
  }


}
