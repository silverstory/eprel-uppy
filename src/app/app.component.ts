import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import 'rxjs/add/operator/takeUntil'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/do'
import { ToastrService } from 'ngx-toastr';
import { contains } from 'ramda'
import { UppyService } from './uppy/uppy.service'

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy, AfterViewInit {
  name = 'Angular 5';

  uppyEvent = new Subject<[string, any, any, any]>()

  uppyPlugins = [
    ["Dashboard", {
      target: '.DashboardContainer',
      replaceTargetContent: true,
      inline: true,
    }],
    ["Tus", { endpoint: 'http://127.0.0.1:1080/' }], // https://master.tus.io/files/
    ["GoogleDrive", { target: "Dashboard", host: "https://server.uppy.io" }],
    ["Dropbox", { target: "Dashboard", host: "https://server.uppy.io" }],
    ["Instagram", { target: "Dashboard", host: "https://server.uppy.io" }],
    ["Webcam", { target: "Dashboard" }]
  ]
  uppyPlugins2 = [
    ["Dashboard", {
      target: '.DashboardContainer2',
      replaceTargetContent: true,
      inline: true,
    }],
    ["Tus", { endpoint: 'http://127.0.0.1:1080/' }], // https://master.tus.io/files/
    ["Dropbox", { target: "Dashboard", host: "https://server.uppy.io" }],
  ]

  onDestroy$ = new Subject<void>()

  constructor(private toastr: ToastrService, private uppyService: UppyService) {
    this.uppyEvent
      .takeUntil(this.onDestroy$)
      .filter(([ev]) => contains(ev, ['complete']))
      .subscribe(
      ([ev, data1, data2, data3]) =>
        this.toastr.success("Received '" + ev + "' event from instance 1", 'Upload complete'),
      (err) => console.dir(err),
      () => console.log('done')
      )
  }

  ngOnDestroy() {
    this.onDestroy$.next()
    this.onDestroy$.complete()
  }

  ngAfterViewInit() {
    const uppy = this.uppyService.uppy
    const instance3 = uppy.Core({ autoProceed: false })
      .use(uppy.Dashboard, {
        target: '.instance3',
        replaceTargetContent: true,
        inline: true,
      })
      .use(uppy.Tus, { endpoint: 'http://127.0.0.1:1080/' }) // https://master.tus.io/files/
      .use(uppy.Webcam, { target: uppy.Dashboard })
      .run()

    instance3.on("complete", (data) => this.toastr.success("Received 'complete' event from instance 3", 'Upload complete'))
  }
}
