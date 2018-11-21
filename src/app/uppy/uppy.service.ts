import { Injectable } from '@angular/core';
import * as Uppy from 'uppy';
import { set, lensProp, compose, reduce, __ } from 'ramda'


@Injectable()
export class UppyService/* extends Uppy*/ {
  readonly uppy = Uppy

  configure(pluginConfig, uuid):any {
    const plugins = pluginConfig.map(([plugin, conf]) => {
      const config =
        plugin != 'Dashboard' && conf.target ? set(lensProp('target'), Uppy[conf.target], conf) :
          set(lensProp('target'), '.DashboardContainer-' + uuid, conf)

      return [Uppy[plugin], config]
    })

    const addPlugin = (uppy: any, [name, conf]: [string, any]) => uppy.use(name, conf)

    const uppyInstance = compose(
      (u: Uppy) => u.run(),
      reduce(addPlugin, __, plugins),
      Uppy.Core
    )({ autoProceed: false })

    return uppyInstance
  }
}