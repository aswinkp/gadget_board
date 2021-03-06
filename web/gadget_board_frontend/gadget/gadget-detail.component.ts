import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouteParams } from '@angular/router-deprecated';
import { Subscription }   from 'rxjs/Subscription';

import { Gadget } from './gadget';
import { GadgetData } from './gadget-data';
import { GadgetService } from './gadget.service';
import { GadgetSwimThermoComponent } from './gadget-swim-thermo.component';

declare var __moduleName: string;  // weird way to make relative template urls work, see https://github.com/angular/angular/issues/6053 

@Component({
    selector: 'gadget-detail',
    moduleId: __moduleName,
    directives: [GadgetSwimThermoComponent],
    templateUrl: './gadget-detail.component.html',
})

export class GadgetDetailComponent implements OnInit, OnDestroy {

    errorMessages: any[];
    gadget: Gadget;
    gadgetDatum: GadgetData;
    gadgetDataSubscription: Subscription;
    fullscreenMode: boolean;

    constructor(
        private gadgetService: GadgetService,
        private routeParams: RouteParams)
    {}

    ngOnInit() {
        // Get gadget
        this.updateDataForGadget(this.routeParams.get('gadget_slug'));
        if (this.routeParams.get('mode')=='fullscreen') {
            this.fullscreenMode = true;
        } else {
            this.fullscreenMode = false;            
        }
    }

    updateDataForGadget(slug: string) {
        this.getGadget(slug);
        this.getGadgetData(slug);
    }
    
    getGadget(slug: string) {
        this.gadgetService.getGadget(slug)
            .subscribe(
                gadget => this.gadget = gadget,
                errors => this.errorMessages = <any[]>errors);
    }

    getGadgetData(slug: string) {
        this.gadgetService.getGadgetDataForGadget(slug, 1)
            .subscribe(
                gadgetData => { if (gadgetData.length>0) this.gadgetDatum = gadgetData[0]; },
                errors => this.errorMessages = <any[]>errors);
        this.gadgetDataSubscription = this.gadgetService.pollGadgetDataForGadget(slug, 1)
            .subscribe(
                gadgetData => { if (gadgetData.length>0) this.gadgetDatum = gadgetData[0]; });
    }

    ngOnDestroy() {
        this.gadgetDataSubscription.unsubscribe();
    }



}