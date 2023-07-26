import {
	AfterViewInit,
	Component,
	ElementRef,
	HostBinding,
	Input, OnChanges,
	OnInit, SimpleChanges,
	SkipSelf,
} from '@angular/core';
import {GridContainerComponent} from '../grid-container/grid-container.component';

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

type Sizes = Partial<Record<Size, number>>;

@Component({
	selector: 'klp-grid-column',
	templateUrl: './grid-column.component.html',
	styleUrls: ['./grid-column.component.scss'],
})
export class GridColumnComponent implements OnInit, AfterViewInit, OnChanges {
	@Input() width: Sizes = {};
	@Input() offset: Sizes = {};

	@HostBinding('style.padding-left') paddingLeft;
	@HostBinding('style.padding-right') paddingRight;
	@HostBinding('class') @Input() class = '';

	private extractSizes(input: Sizes, infix?: string): string[] {
		return Object.keys(input).map((size) =>
			[size, infix, input[size].toString()]
				.filter((x) => x != null && x !== '')
				.join('-')
		);
	}

	constructor(private self: ElementRef, private _container: GridContainerComponent) { }

	ngOnInit(): void {
		this.setClasses();
	}

	private setClasses(prevWidths = {}, prevOffsets = {}): void {
		const classes: string[] = [];

		const prevWidthClasses = this.extractSizes(prevWidths, '');
		const newWidthClasses = this.extractSizes(this.width, '');
		const prevOffsetClasses = this.extractSizes(prevOffsets, 'offset');
		const newOffsetClasses = this.extractSizes(this.offset, 'offset');

		const classesToKeep = this.class.split(' ').filter(e => !prevWidthClasses.includes(e) && !prevOffsetClasses.includes(e));

		classes.push(...newWidthClasses);
		classes.push(...newOffsetClasses);
		classes.push(...classesToKeep);

		this.class = classes.join(' ');

		this.paddingLeft = `${this._container.gutter / 2}px`;
		this.paddingRight = `${this._container.gutter / 2}px`;
	}

	ngOnChanges(simpleChanges: SimpleChanges): void {
		if (simpleChanges.width) {
			this.setClasses(simpleChanges.width.previousValue);
		}
		if (simpleChanges.offset) {
			this.setClasses({}, simpleChanges.offset.previousValue);
		}
	}

	ngAfterViewInit(): void {
		if (!this.self.nativeElement.parentElement.matches('klp-grid-row')) {
			throw new Error('klp-grid-column must be child of klp-grid-row');
		}
	}
}
