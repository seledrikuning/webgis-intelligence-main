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
  "./defaultValue-a6eb9f34",
  "./Matrix2-276d97d2",
  "./ArcType-b714639b",
  "./Transforms-0c3fa360",
  "./Color-33d22ceb",
  "./ComponentDatatype-7f6d9570",
  "./GeometryAttribute-54019f82",
  "./GeometryAttributes-aff51037",
  "./IndexDatatype-856d3a0c",
  "./PolylinePipeline-f9c3fc71",
  "./RuntimeError-07496d94",
  "./_commonjsHelpers-89c9b271",
  "./combine-7cf28d88",
  "./WebGLConstants-d81b330d",
  "./EllipsoidGeodesic-3107c30b",
  "./EllipsoidRhumbLine-f1dbc710",
  "./IntersectionTests-fbcff83c",
  "./Plane-17fe9d66",
], function (e, o, t, l, r, n, i, a, s, c, p, d, f, y, u, h, C, m) {
  "use strict";
  function T(e, o, t, l, n, i, a) {
    const s = c.PolylinePipeline.numberOfPoints(e, o, n);
    let p;
    const d = t.red,
      f = t.green,
      y = t.blue,
      u = t.alpha,
      h = l.red,
      C = l.green,
      m = l.blue,
      T = l.alpha;
    if (r.Color.equals(t, l)) {
      for (p = 0; p < s; p++)
        (i[a++] = r.Color.floatToByte(d)),
          (i[a++] = r.Color.floatToByte(f)),
          (i[a++] = r.Color.floatToByte(y)),
          (i[a++] = r.Color.floatToByte(u));
      return a;
    }
    const g = (h - d) / s,
      b = (C - f) / s,
      _ = (m - y) / s,
      P = (T - u) / s;
    let B = a;
    for (p = 0; p < s; p++)
      (i[B++] = r.Color.floatToByte(d + p * g)),
        (i[B++] = r.Color.floatToByte(f + p * b)),
        (i[B++] = r.Color.floatToByte(y + p * _)),
        (i[B++] = r.Color.floatToByte(u + p * P));
    return B;
  }
  function g(l) {
    const i = (l = e.defaultValue(l, e.defaultValue.EMPTY_OBJECT)).positions,
      a = l.colors,
      s = e.defaultValue(l.colorsPerVertex, !1);
    (this._positions = i),
      (this._colors = a),
      (this._colorsPerVertex = s),
      (this._arcType = e.defaultValue(l.arcType, t.ArcType.GEODESIC)),
      (this._granularity = e.defaultValue(
        l.granularity,
        n.CesiumMath.RADIANS_PER_DEGREE
      )),
      (this._ellipsoid = e.defaultValue(l.ellipsoid, o.Ellipsoid.WGS84)),
      (this._workerName = "createSimplePolylineGeometry");
    let c = 1 + i.length * o.Cartesian3.packedLength;
    (c += e.defined(a) ? 1 + a.length * r.Color.packedLength : 1),
      (this.packedLength = c + o.Ellipsoid.packedLength + 3);
  }
  (g.pack = function (t, l, n) {
    let i;
    n = e.defaultValue(n, 0);
    const a = t._positions;
    let s = a.length;
    for (l[n++] = s, i = 0; i < s; ++i, n += o.Cartesian3.packedLength)
      o.Cartesian3.pack(a[i], l, n);
    const c = t._colors;
    for (
      s = e.defined(c) ? c.length : 0, l[n++] = s, i = 0;
      i < s;
      ++i, n += r.Color.packedLength
    )
      r.Color.pack(c[i], l, n);
    return (
      o.Ellipsoid.pack(t._ellipsoid, l, n),
      (n += o.Ellipsoid.packedLength),
      (l[n++] = t._colorsPerVertex ? 1 : 0),
      (l[n++] = t._arcType),
      (l[n] = t._granularity),
      l
    );
  }),
    (g.unpack = function (t, l, n) {
      let i;
      l = e.defaultValue(l, 0);
      let a = t[l++];
      const s = new Array(a);
      for (i = 0; i < a; ++i, l += o.Cartesian3.packedLength)
        s[i] = o.Cartesian3.unpack(t, l);
      a = t[l++];
      const c = a > 0 ? new Array(a) : void 0;
      for (i = 0; i < a; ++i, l += r.Color.packedLength)
        c[i] = r.Color.unpack(t, l);
      const p = o.Ellipsoid.unpack(t, l);
      l += o.Ellipsoid.packedLength;
      const d = 1 === t[l++],
        f = t[l++],
        y = t[l];
      return e.defined(n)
        ? ((n._positions = s),
          (n._colors = c),
          (n._ellipsoid = p),
          (n._colorsPerVertex = d),
          (n._arcType = f),
          (n._granularity = y),
          n)
        : new g({
            positions: s,
            colors: c,
            ellipsoid: p,
            colorsPerVertex: d,
            arcType: f,
            granularity: y,
          });
    });
  const b = new Array(2),
    _ = new Array(2),
    P = {
      positions: b,
      height: _,
      ellipsoid: void 0,
      minDistance: void 0,
      granularity: void 0,
    };
  return (
    (g.createGeometry = function (p) {
      const d = p._positions,
        f = p._colors,
        y = p._colorsPerVertex,
        u = p._arcType,
        h = p._granularity,
        C = p._ellipsoid,
        m = n.CesiumMath.chordLength(h, C.maximumRadius),
        g = e.defined(f) && !y;
      let B;
      const A = d.length;
      let E,
        k,
        G,
        D,
        L = 0;
      if (u === t.ArcType.GEODESIC || u === t.ArcType.RHUMB) {
        let o, l, i;
        u === t.ArcType.GEODESIC
          ? ((o = n.CesiumMath.chordLength(h, C.maximumRadius)),
            (l = c.PolylinePipeline.numberOfPoints),
            (i = c.PolylinePipeline.generateArc))
          : ((o = h),
            (l = c.PolylinePipeline.numberOfPointsRhumbLine),
            (i = c.PolylinePipeline.generateRhumbArc));
        const a = c.PolylinePipeline.extractHeights(d, C),
          s = P;
        if (
          (u === t.ArcType.GEODESIC ? (s.minDistance = m) : (s.granularity = h),
          (s.ellipsoid = C),
          g)
        ) {
          let t = 0;
          for (B = 0; B < A - 1; B++) t += l(d[B], d[B + 1], o) + 1;
          (E = new Float64Array(3 * t)),
            (G = new Uint8Array(4 * t)),
            (s.positions = b),
            (s.height = _);
          let n = 0;
          for (B = 0; B < A - 1; ++B) {
            (b[0] = d[B]), (b[1] = d[B + 1]), (_[0] = a[B]), (_[1] = a[B + 1]);
            const o = i(s);
            if (e.defined(f)) {
              const e = o.length / 3;
              D = f[B];
              for (let o = 0; o < e; ++o)
                (G[n++] = r.Color.floatToByte(D.red)),
                  (G[n++] = r.Color.floatToByte(D.green)),
                  (G[n++] = r.Color.floatToByte(D.blue)),
                  (G[n++] = r.Color.floatToByte(D.alpha));
            }
            E.set(o, L), (L += o.length);
          }
        } else if (
          ((s.positions = d),
          (s.height = a),
          (E = new Float64Array(i(s))),
          e.defined(f))
        ) {
          for (G = new Uint8Array((E.length / 3) * 4), B = 0; B < A - 1; ++B) {
            L = T(d[B], d[B + 1], f[B], f[B + 1], m, G, L);
          }
          const e = f[A - 1];
          (G[L++] = r.Color.floatToByte(e.red)),
            (G[L++] = r.Color.floatToByte(e.green)),
            (G[L++] = r.Color.floatToByte(e.blue)),
            (G[L++] = r.Color.floatToByte(e.alpha));
        }
      } else {
        (k = g ? 2 * A - 2 : A),
          (E = new Float64Array(3 * k)),
          (G = e.defined(f) ? new Uint8Array(4 * k) : void 0);
        let t = 0,
          l = 0;
        for (B = 0; B < A; ++B) {
          const n = d[B];
          if (
            (g &&
              B > 0 &&
              (o.Cartesian3.pack(n, E, t),
              (t += 3),
              (D = f[B - 1]),
              (G[l++] = r.Color.floatToByte(D.red)),
              (G[l++] = r.Color.floatToByte(D.green)),
              (G[l++] = r.Color.floatToByte(D.blue)),
              (G[l++] = r.Color.floatToByte(D.alpha))),
            g && B === A - 1)
          )
            break;
          o.Cartesian3.pack(n, E, t),
            (t += 3),
            e.defined(f) &&
              ((D = f[B]),
              (G[l++] = r.Color.floatToByte(D.red)),
              (G[l++] = r.Color.floatToByte(D.green)),
              (G[l++] = r.Color.floatToByte(D.blue)),
              (G[l++] = r.Color.floatToByte(D.alpha)));
        }
      }
      const w = new a.GeometryAttributes();
      (w.position = new i.GeometryAttribute({
        componentDatatype: n.ComponentDatatype.DOUBLE,
        componentsPerAttribute: 3,
        values: E,
      })),
        e.defined(f) &&
          (w.color = new i.GeometryAttribute({
            componentDatatype: n.ComponentDatatype.UNSIGNED_BYTE,
            componentsPerAttribute: 4,
            values: G,
            normalize: !0,
          })),
        (k = E.length / 3);
      const V = 2 * (k - 1),
        x = s.IndexDatatype.createTypedArray(k, V);
      let S = 0;
      for (B = 0; B < k - 1; ++B) (x[S++] = B), (x[S++] = B + 1);
      return new i.Geometry({
        attributes: w,
        indices: x,
        primitiveType: i.PrimitiveType.LINES,
        boundingSphere: l.BoundingSphere.fromPoints(d),
      });
    }),
    function (t, l) {
      return (
        e.defined(l) && (t = g.unpack(t, l)),
        (t._ellipsoid = o.Ellipsoid.clone(t._ellipsoid)),
        g.createGeometry(t)
      );
    }
  );
});
