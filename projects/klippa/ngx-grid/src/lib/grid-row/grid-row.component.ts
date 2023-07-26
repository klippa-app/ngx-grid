import {AfterViewInit, Component, ElementRef, HostBinding, OnInit} from '@angular/core';
import {GridContainerComponent} from '../grid-container/grid-container.component';

@Component({
	selector: 'klp-grid-row',
	templateUrl: './grid-row.component.html',
	styleUrls: ['./grid-row.component.scss'],
})
export class GridRowComponent implements AfterViewInit, OnInit {
	@HostBinding('style.margin-left') marginLeft;
	@HostBinding('style.margin-right') marginRight;
	constructor(private _container: GridContainerComponent, private self: ElementRef) {}

	ngOnInit(): void {
		this.marginLeft = `-${this._container.gutter / 2}px`;
		this.marginRight = `-${this._container.gutter / 2}px`;
	}

	allChildrenAreColumns(): boolean {
		const children: Element[] = Array.from(this.self.nativeElement.children);
		return children.reduce((acc, child) => acc && child.matches('klp-grid-column'), true);
	}
	ngAfterViewInit(): void {
		if (!this.allChildrenAreColumns()) {
			throw new Error ('klp-grid-row can only have klp-grid-columns as children.');
		}
	}
}
