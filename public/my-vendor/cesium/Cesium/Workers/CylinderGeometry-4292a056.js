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
  "./CylinderGeometryLibrary-fe6d3640",
  "./defaultValue-a6eb9f34",
  "./GeometryAttribute-54019f82",
  "./GeometryAttributes-aff51037",
  "./GeometryOffsetAttribute-102da468",
  "./IndexDatatype-856d3a0c",
  "./VertexFormat-31cdbccc",
], function (t, e, n, a, o, r, i, s, u, m, c) {
  "use strict";
  const l = new n.Cartesian2(),
    d = new n.Cartesian3(),
    f = new n.Cartesian3(),
    p = new n.Cartesian3(),
    y = new n.Cartesian3();
  function b(t) {
    const e = (t = r.defaultValue(t, r.defaultValue.EMPTY_OBJECT)).length,
      n = t.topRadius,
      a = t.bottomRadius,
      o = r.defaultValue(t.vertexFormat, c.VertexFormat.DEFAULT),
      i = r.defaultValue(t.slices, 128);
    (this._length = e),
      (this._topRadius = n),
      (this._bottomRadius = a),
      (this._vertexFormat = c.VertexFormat.clone(o)),
      (this._slices = i),
      (this._offsetAttribute = t.offsetAttribute),
      (this._workerName = "createCylinderGeometry");
  }
  (b.packedLength = c.VertexFormat.packedLength + 5),
    (b.pack = function (t, e, n) {
      return (
        (n = r.defaultValue(n, 0)),
        c.VertexFormat.pack(t._vertexFormat, e, n),
        (n += c.VertexFormat.packedLength),
        (e[n++] = t._length),
        (e[n++] = t._topRadius),
        (e[n++] = t._bottomRadius),
        (e[n++] = t._slices),
        (e[n] = r.defaultValue(t._offsetAttribute, -1)),
        e
      );
    });
  const A = new c.VertexFormat(),
    x = {
      vertexFormat: A,
      length: void 0,
      topRadius: void 0,
      bottomRadius: void 0,
      slices: void 0,
      offsetAttribute: void 0,
    };
  let g;
  (b.unpack = function (t, e, n) {
    e = r.defaultValue(e, 0);
    const a = c.VertexFormat.unpack(t, e, A);
    e += c.VertexFormat.packedLength;
    const o = t[e++],
      i = t[e++],
      s = t[e++],
      u = t[e++],
      m = t[e];
    return r.defined(n)
      ? ((n._vertexFormat = c.VertexFormat.clone(a, n._vertexFormat)),
        (n._length = o),
        (n._topRadius = i),
        (n._bottomRadius = s),
        (n._slices = u),
        (n._offsetAttribute = -1 === m ? void 0 : m),
        n)
      : ((x.length = o),
        (x.topRadius = i),
        (x.bottomRadius = s),
        (x.slices = u),
        (x.offsetAttribute = -1 === m ? void 0 : m),
        new b(x));
  }),
    (b.createGeometry = function (t) {
      let c = t._length;
      const b = t._topRadius,
        A = t._bottomRadius,
        x = t._vertexFormat,
        g = t._slices;
      if (c <= 0 || b < 0 || A < 0 || (0 === b && 0 === A)) return;
      const _ = g + g,
        h = g + _,
        F = _ + _,
        v = o.CylinderGeometryLibrary.computePositions(c, b, A, g, !0),
        C = x.st ? new Float32Array(2 * F) : void 0,
        w = x.normal ? new Float32Array(3 * F) : void 0,
        G = x.tangent ? new Float32Array(3 * F) : void 0,
        V = x.bitangent ? new Float32Array(3 * F) : void 0;
      let D;
      const R = x.normal || x.tangent || x.bitangent;
      if (R) {
        const t = x.tangent || x.bitangent;
        let e = 0,
          o = 0,
          r = 0;
        const i = Math.atan2(A - b, c),
          s = d;
        s.z = Math.sin(i);
        const u = Math.cos(i);
        let m = p,
          l = f;
        for (D = 0; D < g; D++) {
          const i = (D / g) * a.CesiumMath.TWO_PI,
            c = u * Math.cos(i),
            d = u * Math.sin(i);
          R &&
            ((s.x = c),
            (s.y = d),
            t &&
              (m = n.Cartesian3.normalize(
                n.Cartesian3.cross(n.Cartesian3.UNIT_Z, s, m),
                m
              )),
            x.normal &&
              ((w[e++] = s.x),
              (w[e++] = s.y),
              (w[e++] = s.z),
              (w[e++] = s.x),
              (w[e++] = s.y),
              (w[e++] = s.z)),
            x.tangent &&
              ((G[o++] = m.x),
              (G[o++] = m.y),
              (G[o++] = m.z),
              (G[o++] = m.x),
              (G[o++] = m.y),
              (G[o++] = m.z)),
            x.bitangent &&
              ((l = n.Cartesian3.normalize(n.Cartesian3.cross(s, m, l), l)),
              (V[r++] = l.x),
              (V[r++] = l.y),
              (V[r++] = l.z),
              (V[r++] = l.x),
              (V[r++] = l.y),
              (V[r++] = l.z)));
        }
        for (D = 0; D < g; D++)
          x.normal && ((w[e++] = 0), (w[e++] = 0), (w[e++] = -1)),
            x.tangent && ((G[o++] = 1), (G[o++] = 0), (G[o++] = 0)),
            x.bitangent && ((V[r++] = 0), (V[r++] = -1), (V[r++] = 0));
        for (D = 0; D < g; D++)
          x.normal && ((w[e++] = 0), (w[e++] = 0), (w[e++] = 1)),
            x.tangent && ((G[o++] = 1), (G[o++] = 0), (G[o++] = 0)),
            x.bitangent && ((V[r++] = 0), (V[r++] = 1), (V[r++] = 0));
      }
      const T = 12 * g - 12,
        O = m.IndexDatatype.createTypedArray(F, T);
      let L = 0,
        P = 0;
      for (D = 0; D < g - 1; D++)
        (O[L++] = P),
          (O[L++] = P + 2),
          (O[L++] = P + 3),
          (O[L++] = P),
          (O[L++] = P + 3),
          (O[L++] = P + 1),
          (P += 2);
      for (
        O[L++] = _ - 2,
          O[L++] = 0,
          O[L++] = 1,
          O[L++] = _ - 2,
          O[L++] = 1,
          O[L++] = _ - 1,
          D = 1;
        D < g - 1;
        D++
      )
        (O[L++] = _ + D + 1), (O[L++] = _ + D), (O[L++] = _);
      for (D = 1; D < g - 1; D++)
        (O[L++] = h), (O[L++] = h + D), (O[L++] = h + D + 1);
      let M = 0;
      if (x.st) {
        const t = Math.max(b, A);
        for (D = 0; D < F; D++) {
          const e = n.Cartesian3.fromArray(v, 3 * D, y);
          (C[M++] = (e.x + t) / (2 * t)), (C[M++] = (e.y + t) / (2 * t));
        }
      }
      const k = new s.GeometryAttributes();
      x.position &&
        (k.position = new i.GeometryAttribute({
          componentDatatype: a.ComponentDatatype.DOUBLE,
          componentsPerAttribute: 3,
          values: v,
        })),
        x.normal &&
          (k.normal = new i.GeometryAttribute({
            componentDatatype: a.ComponentDatatype.FLOAT,
            componentsPerAttribute: 3,
            values: w,
          })),
        x.tangent &&
          (k.tangent = new i.GeometryAttribute({
            componentDatatype: a.ComponentDatatype.FLOAT,
            componentsPerAttribute: 3,
            values: G,
          })),
        x.bitangent &&
          (k.bitangent = new i.GeometryAttribute({
            componentDatatype: a.ComponentDatatype.FLOAT,
            componentsPerAttribute: 3,
            values: V,
          })),
        x.st &&
          (k.st = new i.GeometryAttribute({
            componentDatatype: a.ComponentDatatype.FLOAT,
            componentsPerAttribute: 2,
            values: C,
          })),
        (l.x = 0.5 * c),
        (l.y = Math.max(A, b));
      const z = new e.BoundingSphere(
        n.Cartesian3.ZERO,
        n.Cartesian2.magnitude(l)
      );
      if (r.defined(t._offsetAttribute)) {
        c = v.length;
        const e = t._offsetAttribute === u.GeometryOffsetAttribute.NONE ? 0 : 1,
          n = new Uint8Array(c / 3).fill(e);
        k.applyOffset = new i.GeometryAttribute({
          componentDatatype: a.ComponentDatatype.UNSIGNED_BYTE,
          componentsPerAttribute: 1,
          values: n,
        });
      }
      return new i.Geometry({
        attributes: k,
        indices: O,
        primitiveType: i.PrimitiveType.TRIANGLES,
        boundingSphere: z,
        offsetAttribute: t._offsetAttribute,
      });
    }),
    (b.getUnitCylinder = function () {
      return (
        r.defined(g) ||
          (g = b.createGeometry(
            new b({
              topRadius: 1,
              bottomRadius: 1,
              length: 1,
              vertexFormat: c.VertexFormat.POSITION_ONLY,
            })
          )),
        g
      );
    }),
    (t.CylinderGeometry = b);
});
