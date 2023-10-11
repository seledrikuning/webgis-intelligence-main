/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.97
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */
define([
  "exports",
  "./Transforms-0c3fa360",
  "./Matrix2-276d97d2",
  "./ComponentDatatype-7f6d9570",
  "./defaultValue-a6eb9f34",
  "./EllipseGeometryLibrary-65924704",
  "./GeometryAttribute-54019f82",
  "./GeometryAttributes-aff51037",
  "./GeometryOffsetAttribute-102da468",
  "./IndexDatatype-856d3a0c",
], function (e, t, i, r, n, a, o, s, l, u) {
  "use strict";
  const d = new i.Cartesian3();
  let c = new i.Cartesian3();
  const f = new t.BoundingSphere(),
    p = new t.BoundingSphere();
  function m(e) {
    const t = (e = n.defaultValue(e, n.defaultValue.EMPTY_OBJECT)).center,
      a = n.defaultValue(e.ellipsoid, i.Ellipsoid.WGS84),
      o = e.semiMajorAxis,
      s = e.semiMinorAxis,
      l = n.defaultValue(e.granularity, r.CesiumMath.RADIANS_PER_DEGREE),
      u = n.defaultValue(e.height, 0),
      d = n.defaultValue(e.extrudedHeight, u);
    (this._center = i.Cartesian3.clone(t)),
      (this._semiMajorAxis = o),
      (this._semiMinorAxis = s),
      (this._ellipsoid = i.Ellipsoid.clone(a)),
      (this._rotation = n.defaultValue(e.rotation, 0)),
      (this._height = Math.max(d, u)),
      (this._granularity = l),
      (this._extrudedHeight = Math.min(d, u)),
      (this._numberOfVerticalLines = Math.max(
        n.defaultValue(e.numberOfVerticalLines, 16),
        0
      )),
      (this._offsetAttribute = e.offsetAttribute),
      (this._workerName = "createEllipseOutlineGeometry");
  }
  (m.packedLength = i.Cartesian3.packedLength + i.Ellipsoid.packedLength + 8),
    (m.pack = function (e, t, r) {
      return (
        (r = n.defaultValue(r, 0)),
        i.Cartesian3.pack(e._center, t, r),
        (r += i.Cartesian3.packedLength),
        i.Ellipsoid.pack(e._ellipsoid, t, r),
        (r += i.Ellipsoid.packedLength),
        (t[r++] = e._semiMajorAxis),
        (t[r++] = e._semiMinorAxis),
        (t[r++] = e._rotation),
        (t[r++] = e._height),
        (t[r++] = e._granularity),
        (t[r++] = e._extrudedHeight),
        (t[r++] = e._numberOfVerticalLines),
        (t[r] = n.defaultValue(e._offsetAttribute, -1)),
        t
      );
    });
  const h = new i.Cartesian3(),
    y = new i.Ellipsoid(),
    A = {
      center: h,
      ellipsoid: y,
      semiMajorAxis: void 0,
      semiMinorAxis: void 0,
      rotation: void 0,
      height: void 0,
      granularity: void 0,
      extrudedHeight: void 0,
      numberOfVerticalLines: void 0,
      offsetAttribute: void 0,
    };
  (m.unpack = function (e, t, r) {
    t = n.defaultValue(t, 0);
    const a = i.Cartesian3.unpack(e, t, h);
    t += i.Cartesian3.packedLength;
    const o = i.Ellipsoid.unpack(e, t, y);
    t += i.Ellipsoid.packedLength;
    const s = e[t++],
      l = e[t++],
      u = e[t++],
      d = e[t++],
      c = e[t++],
      f = e[t++],
      p = e[t++],
      _ = e[t];
    return n.defined(r)
      ? ((r._center = i.Cartesian3.clone(a, r._center)),
        (r._ellipsoid = i.Ellipsoid.clone(o, r._ellipsoid)),
        (r._semiMajorAxis = s),
        (r._semiMinorAxis = l),
        (r._rotation = u),
        (r._height = d),
        (r._granularity = c),
        (r._extrudedHeight = f),
        (r._numberOfVerticalLines = p),
        (r._offsetAttribute = -1 === _ ? void 0 : _),
        r)
      : ((A.height = d),
        (A.extrudedHeight = f),
        (A.granularity = c),
        (A.rotation = u),
        (A.semiMajorAxis = s),
        (A.semiMinorAxis = l),
        (A.numberOfVerticalLines = p),
        (A.offsetAttribute = -1 === _ ? void 0 : _),
        new m(A));
  }),
    (m.createGeometry = function (e) {
      if (e._semiMajorAxis <= 0 || e._semiMinorAxis <= 0) return;
      const m = e._height,
        h = e._extrudedHeight,
        y = !r.CesiumMath.equalsEpsilon(m, h, 0, r.CesiumMath.EPSILON2);
      e._center = e._ellipsoid.scaleToGeodeticSurface(e._center, e._center);
      const A = {
        center: e._center,
        semiMajorAxis: e._semiMajorAxis,
        semiMinorAxis: e._semiMinorAxis,
        ellipsoid: e._ellipsoid,
        rotation: e._rotation,
        height: m,
        granularity: e._granularity,
        numberOfVerticalLines: e._numberOfVerticalLines,
      };
      let _;
      if (y)
        (A.extrudedHeight = h),
          (A.offsetAttribute = e._offsetAttribute),
          (_ = (function (e) {
            const c = e.center,
              m = e.ellipsoid,
              h = e.semiMajorAxis;
            let y = i.Cartesian3.multiplyByScalar(
              m.geodeticSurfaceNormal(c, d),
              e.height,
              d
            );
            (f.center = i.Cartesian3.add(c, y, f.center)),
              (f.radius = h),
              (y = i.Cartesian3.multiplyByScalar(
                m.geodeticSurfaceNormal(c, y),
                e.extrudedHeight,
                y
              )),
              (p.center = i.Cartesian3.add(c, y, p.center)),
              (p.radius = h);
            let A = a.EllipseGeometryLibrary.computeEllipsePositions(
              e,
              !1,
              !0
            ).outerPositions;
            const _ = new s.GeometryAttributes({
              position: new o.GeometryAttribute({
                componentDatatype: r.ComponentDatatype.DOUBLE,
                componentsPerAttribute: 3,
                values: a.EllipseGeometryLibrary.raisePositionsToHeight(
                  A,
                  e,
                  !0
                ),
              }),
            });
            A = _.position.values;
            const b = t.BoundingSphere.union(f, p);
            let g = A.length / 3;
            if (n.defined(e.offsetAttribute)) {
              let t = new Uint8Array(g);
              if (e.offsetAttribute === l.GeometryOffsetAttribute.TOP)
                t = t.fill(1, 0, g / 2);
              else {
                const i =
                  e.offsetAttribute === l.GeometryOffsetAttribute.NONE ? 0 : 1;
                t = t.fill(i);
              }
              _.applyOffset = new o.GeometryAttribute({
                componentDatatype: r.ComponentDatatype.UNSIGNED_BYTE,
                componentsPerAttribute: 1,
                values: t,
              });
            }
            let x = n.defaultValue(e.numberOfVerticalLines, 16);
            x = r.CesiumMath.clamp(x, 0, g / 2);
            const E = u.IndexDatatype.createTypedArray(g, 2 * g + 2 * x);
            g /= 2;
            let M,
              C,
              G = 0;
            for (M = 0; M < g; ++M)
              (E[G++] = M),
                (E[G++] = (M + 1) % g),
                (E[G++] = M + g),
                (E[G++] = ((M + 1) % g) + g);
            if (x > 0) {
              const e = Math.min(x, g);
              C = Math.round(g / e);
              const t = Math.min(C * x, g);
              for (M = 0; M < t; M += C) (E[G++] = M), (E[G++] = M + g);
            }
            return { boundingSphere: b, attributes: _, indices: E };
          })(A));
      else if (
        ((_ = (function (e) {
          const n = e.center;
          (c = i.Cartesian3.multiplyByScalar(
            e.ellipsoid.geodeticSurfaceNormal(n, c),
            e.height,
            c
          )),
            (c = i.Cartesian3.add(n, c, c));
          const l = new t.BoundingSphere(c, e.semiMajorAxis),
            d = a.EllipseGeometryLibrary.computeEllipsePositions(
              e,
              !1,
              !0
            ).outerPositions,
            f = new s.GeometryAttributes({
              position: new o.GeometryAttribute({
                componentDatatype: r.ComponentDatatype.DOUBLE,
                componentsPerAttribute: 3,
                values: a.EllipseGeometryLibrary.raisePositionsToHeight(
                  d,
                  e,
                  !1
                ),
              }),
            }),
            p = d.length / 3,
            m = u.IndexDatatype.createTypedArray(p, 2 * p);
          let h = 0;
          for (let e = 0; e < p; ++e) (m[h++] = e), (m[h++] = (e + 1) % p);
          return { boundingSphere: l, attributes: f, indices: m };
        })(A)),
        n.defined(e._offsetAttribute))
      ) {
        const t = _.attributes.position.values.length,
          i = e._offsetAttribute === l.GeometryOffsetAttribute.NONE ? 0 : 1,
          n = new Uint8Array(t / 3).fill(i);
        _.attributes.applyOffset = new o.GeometryAttribute({
          componentDatatype: r.ComponentDatatype.UNSIGNED_BYTE,
          componentsPerAttribute: 1,
          values: n,
        });
      }
      return new o.Geometry({
        attributes: _.attributes,
        indices: _.indices,
        primitiveType: o.PrimitiveType.LINES,
        boundingSphere: _.boundingSphere,
        offsetAttribute: e._offsetAttribute,
      });
    }),
    (e.EllipseOutlineGeometry = m);
});
