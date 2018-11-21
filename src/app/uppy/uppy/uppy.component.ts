import { Component, OnInit, AfterViewInit, ViewEncapsulation, Input, ChangeDetectionStrategy } from '@angular/core';
import { set, lensProp, compose, reduce, __ } from 'ramda'
import { Subject } from 'rxjs/Subject'
import * as Uppy from 'uppy';
import { UppyService } from '../uppy.service';
import { v4 } from 'uuid'



console.dir(Uppy)
/*export enum UppyPlugins {
  Tus,
  GoogleDrive,
  Dropbox,
  Instagram,
  Webcam
}*/

export type UppyPluginConfigurations = [
  String,
  any
][]

@Component({
  selector: 'uppy',
  templateUrl: './uppy.component.html',
  styleUrls: ['./uppy.component.css',],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UppyComponent implements OnInit, AfterViewInit {
  @Input() plugins: UppyPluginConfigurations = []
  @Input() on: Subject<[string, any, any, any]>

  uuid = v4()

  constructor(public uppyService: UppyService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const uppyInstance = this.uppyService.configure(this.plugins, this.uuid)

    const events = ['file-added', 'file-removed', 'upload', 'upload-progress', 'upload-success', 'complete', 'upload-error', 'info-visible', 'info-hidden']

    events.forEach(ev => uppyInstance.on(ev, (data1, data2, data3) => {
      if (this.on)
        this.on.next([ev, data1, data2, data3])

    }))

  }

}