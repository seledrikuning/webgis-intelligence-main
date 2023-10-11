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
  "./GeometryInstance-52eaddec",
  "./GeometryOffsetAttribute-102da468",
  "./GeometryPipeline-f46d7519",
  "./IndexDatatype-856d3a0c",
  "./VertexFormat-31cdbccc",
], function (t, e, i, r, n, o, a, s, l, u, m, c, p) {
  "use strict";
  const y = new i.Cartesian3(),
    d = new i.Cartesian3(),
    f = new i.Cartesian3(),
    A = new i.Cartesian3(),
    x = new i.Cartesian2(),
    h = new i.Matrix3(),
    g = new i.Matrix3(),
    _ = new e.Quaternion(),
    b = new i.Cartesian3(),
    C = new i.Cartesian3(),
    w = new i.Cartesian3(),
    M = new i.Cartographic(),
    E = new i.Cartesian3(),
    I = new i.Cartesian2(),
    T = new i.Cartesian2();
  function G(t, l, m) {
    const c = l.vertexFormat,
      p = l.center,
      A = l.semiMajorAxis,
      G = l.semiMinorAxis,
      N = l.ellipsoid,
      P = l.stRotation,
      v = m ? (t.length / 3) * 2 : t.length / 3,
      V = l.shadowVolume,
      F = c.st ? new Float32Array(2 * v) : void 0,
      D = c.normal ? new Float32Array(3 * v) : void 0,
      O = c.tangent ? new Float32Array(3 * v) : void 0,
      S = c.bitangent ? new Float32Array(3 * v) : void 0,
      L = V ? new Float32Array(3 * v) : void 0;
    let R = 0,
      j = b,
      z = C,
      k = w;
    const B = new e.GeographicProjection(N),
      Y = B.project(N.cartesianToCartographic(p, M), E),
      H = N.scaleToGeodeticSurface(p, y);
    N.geodeticSurfaceNormal(H, H);
    let U = h,
      Q = g;
    if (0 !== P) {
      let t = e.Quaternion.fromAxisAngle(H, P, _);
      (U = i.Matrix3.fromQuaternion(t, U)),
        (t = e.Quaternion.fromAxisAngle(H, -P, _)),
        (Q = i.Matrix3.fromQuaternion(t, Q));
    } else
      (U = i.Matrix3.clone(i.Matrix3.IDENTITY, U)),
        (Q = i.Matrix3.clone(i.Matrix3.IDENTITY, Q));
    const W = i.Cartesian2.fromElements(
        Number.POSITIVE_INFINITY,
        Number.POSITIVE_INFINITY,
        I
      ),
      J = i.Cartesian2.fromElements(
        Number.NEGATIVE_INFINITY,
        Number.NEGATIVE_INFINITY,
        T
      );
    let q = t.length;
    const Z = m ? q : 0,
      K = (Z / 3) * 2;
    for (let e = 0; e < q; e += 3) {
      const r = e + 1,
        n = e + 2,
        o = i.Cartesian3.fromArray(t, e, y);
      if (c.st) {
        const t = i.Matrix3.multiplyByVector(U, o, d),
          e = B.project(N.cartesianToCartographic(t, M), f);
        i.Cartesian3.subtract(e, Y, e),
          (x.x = (e.x + A) / (2 * A)),
          (x.y = (e.y + G) / (2 * G)),
          (W.x = Math.min(x.x, W.x)),
          (W.y = Math.min(x.y, W.y)),
          (J.x = Math.max(x.x, J.x)),
          (J.y = Math.max(x.y, J.y)),
          m && ((F[R + K] = x.x), (F[R + 1 + K] = x.y)),
          (F[R++] = x.x),
          (F[R++] = x.y);
      }
      (c.normal || c.tangent || c.bitangent || V) &&
        ((j = N.geodeticSurfaceNormal(o, j)),
        V && ((L[e + Z] = -j.x), (L[r + Z] = -j.y), (L[n + Z] = -j.z)),
        (c.normal || c.tangent || c.bitangent) &&
          ((c.tangent || c.bitangent) &&
            ((z = i.Cartesian3.normalize(
              i.Cartesian3.cross(i.Cartesian3.UNIT_Z, j, z),
              z
            )),
            i.Matrix3.multiplyByVector(Q, z, z)),
          c.normal &&
            ((D[e] = j.x),
            (D[r] = j.y),
            (D[n] = j.z),
            m && ((D[e + Z] = -j.x), (D[r + Z] = -j.y), (D[n + Z] = -j.z))),
          c.tangent &&
            ((O[e] = z.x),
            (O[r] = z.y),
            (O[n] = z.z),
            m && ((O[e + Z] = -z.x), (O[r + Z] = -z.y), (O[n + Z] = -z.z))),
          c.bitangent &&
            ((k = i.Cartesian3.normalize(i.Cartesian3.cross(j, z, k), k)),
            (S[e] = k.x),
            (S[r] = k.y),
            (S[n] = k.z),
            m && ((S[e + Z] = k.x), (S[r + Z] = k.y), (S[n + Z] = k.z)))));
    }
    if (c.st) {
      q = F.length;
      for (let t = 0; t < q; t += 2)
        (F[t] = (F[t] - W.x) / (J.x - W.x)),
          (F[t + 1] = (F[t + 1] - W.y) / (J.y - W.y));
    }
    const X = new s.GeometryAttributes();
    if (c.position) {
      const e = o.EllipseGeometryLibrary.raisePositionsToHeight(t, l, m);
      X.position = new a.GeometryAttribute({
        componentDatatype: r.ComponentDatatype.DOUBLE,
        componentsPerAttribute: 3,
        values: e,
      });
    }
    if (
      (c.st &&
        (X.st = new a.GeometryAttribute({
          componentDatatype: r.ComponentDatatype.FLOAT,
          componentsPerAttribute: 2,
          values: F,
        })),
      c.normal &&
        (X.normal = new a.GeometryAttribute({
          componentDatatype: r.ComponentDatatype.FLOAT,
          componentsPerAttribute: 3,
          values: D,
        })),
      c.tangent &&
        (X.tangent = new a.GeometryAttribute({
          componentDatatype: r.ComponentDatatype.FLOAT,
          componentsPerAttribute: 3,
          values: O,
        })),
      c.bitangent &&
        (X.bitangent = new a.GeometryAttribute({
          componentDatatype: r.ComponentDatatype.FLOAT,
          componentsPerAttribute: 3,
          values: S,
        })),
      V &&
        (X.extrudeDirection = new a.GeometryAttribute({
          componentDatatype: r.ComponentDatatype.FLOAT,
          componentsPerAttribute: 3,
          values: L,
        })),
      m && n.defined(l.offsetAttribute))
    ) {
      let t = new Uint8Array(v);
      if (l.offsetAttribute === u.GeometryOffsetAttribute.TOP)
        t = t.fill(1, 0, v / 2);
      else {
        const e = l.offsetAttribute === u.GeometryOffsetAttribute.NONE ? 0 : 1;
        t = t.fill(e);
      }
      X.applyOffset = new a.GeometryAttribute({
        componentDatatype: r.ComponentDatatype.UNSIGNED_BYTE,
        componentsPerAttribute: 1,
        values: t,
      });
    }
    return X;
  }
  function N(t) {
    const e = new Array(t * (t + 1) * 12 - 6);
    let i,
      r,
      n,
      o,
      a,
      s = 0;
    for (i = 0, n = 1, o = 0; o < 3; o++)
      (e[s++] = n++), (e[s++] = i), (e[s++] = n);
    for (o = 2; o < t + 1; ++o) {
      for (
        n = o * (o + 1) - 1,
          i = (o - 1) * o - 1,
          e[s++] = n++,
          e[s++] = i,
          e[s++] = n,
          r = 2 * o,
          a = 0;
        a < r - 1;
        ++a
      )
        (e[s++] = n),
          (e[s++] = i++),
          (e[s++] = i),
          (e[s++] = n++),
          (e[s++] = i),
          (e[s++] = n);
      (e[s++] = n++), (e[s++] = i), (e[s++] = n);
    }
    for (r = 2 * t, ++n, ++i, o = 0; o < r - 1; ++o)
      (e[s++] = n),
        (e[s++] = i++),
        (e[s++] = i),
        (e[s++] = n++),
        (e[s++] = i),
        (e[s++] = n);
    for (
      e[s++] = n,
        e[s++] = i++,
        e[s++] = i,
        e[s++] = n++,
        e[s++] = i++,
        e[s++] = i,
        ++i,
        o = t - 1;
      o > 1;
      --o
    ) {
      for (
        e[s++] = i++, e[s++] = i, e[s++] = n, r = 2 * o, a = 0;
        a < r - 1;
        ++a
      )
        (e[s++] = n),
          (e[s++] = i++),
          (e[s++] = i),
          (e[s++] = n++),
          (e[s++] = i),
          (e[s++] = n);
      (e[s++] = i++), (e[s++] = i++), (e[s++] = n++);
    }
    for (o = 0; o < 3; o++) (e[s++] = i++), (e[s++] = i), (e[s++] = n);
    return e;
  }
  let P = new i.Cartesian3();
  const v = new e.BoundingSphere(),
    V = new e.BoundingSphere();
  function F(t) {
    const p = t.center,
      g = t.ellipsoid,
      P = t.semiMajorAxis;
    let F = i.Cartesian3.multiplyByScalar(
      g.geodeticSurfaceNormal(p, y),
      t.height,
      y
    );
    (v.center = i.Cartesian3.add(p, F, v.center)),
      (v.radius = P),
      (F = i.Cartesian3.multiplyByScalar(
        g.geodeticSurfaceNormal(p, F),
        t.extrudedHeight,
        F
      )),
      (V.center = i.Cartesian3.add(p, F, V.center)),
      (V.radius = P);
    const D = o.EllipseGeometryLibrary.computeEllipsePositions(t, !0, !0),
      O = D.positions,
      S = D.numPts,
      L = D.outerPositions,
      R = e.BoundingSphere.union(v, V),
      j = G(O, t, !0);
    let z = N(S);
    const k = z.length;
    z.length = 2 * k;
    const B = O.length / 3;
    for (let t = 0; t < k; t += 3)
      (z[t + k] = z[t + 2] + B),
        (z[t + 1 + k] = z[t + 1] + B),
        (z[t + 2 + k] = z[t] + B);
    const Y = c.IndexDatatype.createTypedArray((2 * B) / 3, z),
      H = new a.Geometry({
        attributes: j,
        indices: Y,
        primitiveType: a.PrimitiveType.TRIANGLES,
      }),
      U = (function (t, o) {
        const l = o.vertexFormat,
          m = o.center,
          c = o.semiMajorAxis,
          p = o.semiMinorAxis,
          g = o.ellipsoid,
          G = o.height,
          N = o.extrudedHeight,
          P = o.stRotation,
          v = (t.length / 3) * 2,
          V = new Float64Array(3 * v),
          F = l.st ? new Float32Array(2 * v) : void 0,
          D = l.normal ? new Float32Array(3 * v) : void 0,
          O = l.tangent ? new Float32Array(3 * v) : void 0,
          S = l.bitangent ? new Float32Array(3 * v) : void 0,
          L = o.shadowVolume,
          R = L ? new Float32Array(3 * v) : void 0;
        let j = 0,
          z = b,
          k = C,
          B = w;
        const Y = new e.GeographicProjection(g),
          H = Y.project(g.cartesianToCartographic(m, M), E),
          U = g.scaleToGeodeticSurface(m, y);
        g.geodeticSurfaceNormal(U, U);
        const Q = e.Quaternion.fromAxisAngle(U, P, _),
          W = i.Matrix3.fromQuaternion(Q, h),
          J = i.Cartesian2.fromElements(
            Number.POSITIVE_INFINITY,
            Number.POSITIVE_INFINITY,
            I
          ),
          q = i.Cartesian2.fromElements(
            Number.NEGATIVE_INFINITY,
            Number.NEGATIVE_INFINITY,
            T
          );
        let Z = t.length;
        const K = (Z / 3) * 2;
        for (let e = 0; e < Z; e += 3) {
          const r = e + 1,
            n = e + 2;
          let o,
            a = i.Cartesian3.fromArray(t, e, y);
          if (l.st) {
            const t = i.Matrix3.multiplyByVector(W, a, d),
              e = Y.project(g.cartesianToCartographic(t, M), f);
            i.Cartesian3.subtract(e, H, e),
              (x.x = (e.x + c) / (2 * c)),
              (x.y = (e.y + p) / (2 * p)),
              (J.x = Math.min(x.x, J.x)),
              (J.y = Math.min(x.y, J.y)),
              (q.x = Math.max(x.x, q.x)),
              (q.y = Math.max(x.y, q.y)),
              (F[j + K] = x.x),
              (F[j + 1 + K] = x.y),
              (F[j++] = x.x),
              (F[j++] = x.y);
          }
          (a = g.scaleToGeodeticSurface(a, a)),
            (o = i.Cartesian3.clone(a, d)),
            (z = g.geodeticSurfaceNormal(a, z)),
            L && ((R[e + Z] = -z.x), (R[r + Z] = -z.y), (R[n + Z] = -z.z));
          let s = i.Cartesian3.multiplyByScalar(z, G, A);
          if (
            ((a = i.Cartesian3.add(a, s, a)),
            (s = i.Cartesian3.multiplyByScalar(z, N, s)),
            (o = i.Cartesian3.add(o, s, o)),
            l.position &&
              ((V[e + Z] = o.x),
              (V[r + Z] = o.y),
              (V[n + Z] = o.z),
              (V[e] = a.x),
              (V[r] = a.y),
              (V[n] = a.z)),
            l.normal || l.tangent || l.bitangent)
          ) {
            B = i.Cartesian3.clone(z, B);
            const s = i.Cartesian3.fromArray(t, (e + 3) % Z, A);
            i.Cartesian3.subtract(s, a, s);
            const u = i.Cartesian3.subtract(o, a, f);
            (z = i.Cartesian3.normalize(i.Cartesian3.cross(u, s, z), z)),
              l.normal &&
                ((D[e] = z.x),
                (D[r] = z.y),
                (D[n] = z.z),
                (D[e + Z] = z.x),
                (D[r + Z] = z.y),
                (D[n + Z] = z.z)),
              l.tangent &&
                ((k = i.Cartesian3.normalize(i.Cartesian3.cross(B, z, k), k)),
                (O[e] = k.x),
                (O[r] = k.y),
                (O[n] = k.z),
                (O[e + Z] = k.x),
                (O[e + 1 + Z] = k.y),
                (O[e + 2 + Z] = k.z)),
              l.bitangent &&
                ((S[e] = B.x),
                (S[r] = B.y),
                (S[n] = B.z),
                (S[e + Z] = B.x),
                (S[r + Z] = B.y),
                (S[n + Z] = B.z));
          }
        }
        if (l.st) {
          Z = F.length;
          for (let t = 0; t < Z; t += 2)
            (F[t] = (F[t] - J.x) / (q.x - J.x)),
              (F[t + 1] = (F[t + 1] - J.y) / (q.y - J.y));
        }
        const X = new s.GeometryAttributes();
        if (
          (l.position &&
            (X.position = new a.GeometryAttribute({
              componentDatatype: r.ComponentDatatype.DOUBLE,
              componentsPerAttribute: 3,
              values: V,
            })),
          l.st &&
            (X.st = new a.GeometryAttribute({
              componentDatatype: r.ComponentDatatype.FLOAT,
              componentsPerAttribute: 2,
              values: F,
            })),
          l.normal &&
            (X.normal = new a.GeometryAttribute({
              componentDatatype: r.ComponentDatatype.FLOAT,
              componentsPerAttribute: 3,
              values: D,
            })),
          l.tangent &&
            (X.tangent = new a.GeometryAttribute({
              componentDatatype: r.ComponentDatatype.FLOAT,
              componentsPerAttribute: 3,
              values: O,
            })),
          l.bitangent &&
            (X.bitangent = new a.GeometryAttribute({
              componentDatatype: r.ComponentDatatype.FLOAT,
              componentsPerAttribute: 3,
              values: S,
            })),
          L &&
            (X.extrudeDirection = new a.GeometryAttribute({
              componentDatatype: r.ComponentDatatype.FLOAT,
              componentsPerAttribute: 3,
              values: R,
            })),
          n.defined(o.offsetAttribute))
        ) {
          let t = new Uint8Array(v);
          if (o.offsetAttribute === u.GeometryOffsetAttribute.TOP)
            t = t.fill(1, 0, v / 2);
          else {
            const e =
              o.offsetAttribute === u.GeometryOffsetAttribute.NONE ? 0 : 1;
            t = t.fill(e);
          }
          X.applyOffset = new a.GeometryAttribute({
            componentDatatype: r.ComponentDatatype.UNSIGNED_BYTE,
            componentsPerAttribute: 1,
            values: t,
          });
        }
        return X;
      })(L, t);
    z = (function (t) {
      const e = t.length / 3,
        i = c.IndexDatatype.createTypedArray(e, 6 * e);
      let r = 0;
      for (let t = 0; t < e; t++) {
        const n = t,
          o = t + e,
          a = (n + 1) % e,
          s = a + e;
        (i[r++] = n),
          (i[r++] = o),
          (i[r++] = a),
          (i[r++] = a),
          (i[r++] = o),
          (i[r++] = s);
      }
      return i;
    })(L);
    const Q = c.IndexDatatype.createTypedArray((2 * L.length) / 3, z),
      W = new a.Geometry({
        attributes: U,
        indices: Q,
        primitiveType: a.PrimitiveType.TRIANGLES,
      }),
      J = m.GeometryPipeline.combineInstances([
        new l.GeometryInstance({ geometry: H }),
        new l.GeometryInstance({ geometry: W }),
      ]);
    return {
      boundingSphere: R,
      attributes: J[0].attributes,
      indices: J[0].indices,
    };
  }
  function D(t, e, n, a, s, l, u) {
    const m = o.EllipseGeometryLibrary.computeEllipsePositions(
        {
          center: t,
          semiMajorAxis: e,
          semiMinorAxis: n,
          rotation: a,
          granularity: s,
        },
        !1,
        !0
      ).outerPositions,
      c = m.length / 3,
      p = new Array(c);
    for (let t = 0; t < c; ++t) p[t] = i.Cartesian3.fromArray(m, 3 * t);
    const y = i.Rectangle.fromCartesianArray(p, l, u);
    return (
      y.width > r.CesiumMath.PI &&
        ((y.north =
          y.north > 0
            ? r.CesiumMath.PI_OVER_TWO - r.CesiumMath.EPSILON7
            : y.north),
        (y.south =
          y.south < 0
            ? r.CesiumMath.EPSILON7 - r.CesiumMath.PI_OVER_TWO
            : y.south),
        (y.east = r.CesiumMath.PI),
        (y.west = -r.CesiumMath.PI)),
      y
    );
  }
  function O(t) {
    const e = (t = n.defaultValue(t, n.defaultValue.EMPTY_OBJECT)).center,
      o = n.defaultValue(t.ellipsoid, i.Ellipsoid.WGS84),
      a = t.semiMajorAxis,
      s = t.semiMinorAxis,
      l = n.defaultValue(t.granularity, r.CesiumMath.RADIANS_PER_DEGREE),
      u = n.defaultValue(t.vertexFormat, p.VertexFormat.DEFAULT),
      m = n.defaultValue(t.height, 0),
      c = n.defaultValue(t.extrudedHeight, m);
    (this._center = i.Cartesian3.clone(e)),
      (this._semiMajorAxis = a),
      (this._semiMinorAxis = s),
      (this._ellipsoid = i.Ellipsoid.clone(o)),
      (this._rotation = n.defaultValue(t.rotation, 0)),
      (this._stRotation = n.defaultValue(t.stRotation, 0)),
      (this._height = Math.max(c, m)),
      (this._granularity = l),
      (this._vertexFormat = p.VertexFormat.clone(u)),
      (this._extrudedHeight = Math.min(c, m)),
      (this._shadowVolume = n.defaultValue(t.shadowVolume, !1)),
      (this._workerName = "createEllipseGeometry"),
      (this._offsetAttribute = t.offsetAttribute),
      (this._rectangle = void 0),
      (this._textureCoordinateRotationPoints = void 0);
  }
  (O.packedLength =
    i.Cartesian3.packedLength +
    i.Ellipsoid.packedLength +
    p.VertexFormat.packedLength +
    9),
    (O.pack = function (t, e, r) {
      return (
        (r = n.defaultValue(r, 0)),
        i.Cartesian3.pack(t._center, e, r),
        (r += i.Cartesian3.packedLength),
        i.Ellipsoid.pack(t._ellipsoid, e, r),
        (r += i.Ellipsoid.packedLength),
        p.VertexFormat.pack(t._vertexFormat, e, r),
        (r += p.VertexFormat.packedLength),
        (e[r++] = t._semiMajorAxis),
        (e[r++] = t._semiMinorAxis),
        (e[r++] = t._rotation),
        (e[r++] = t._stRotation),
        (e[r++] = t._height),
        (e[r++] = t._granularity),
        (e[r++] = t._extrudedHeight),
        (e[r++] = t._shadowVolume ? 1 : 0),
        (e[r] = n.defaultValue(t._offsetAttribute, -1)),
        e
      );
    });
  const S = new i.Cartesian3(),
    L = new i.Ellipsoid(),
    R = new p.VertexFormat(),
    j = {
      center: S,
      ellipsoid: L,
      vertexFormat: R,
      semiMajorAxis: void 0,
      semiMinorAxis: void 0,
      rotation: void 0,
      stRotation: void 0,
      height: void 0,
      granularity: void 0,
      extrudedHeight: void 0,
      shadowVolume: void 0,
      offsetAttribute: void 0,
    };
  (O.unpack = function (t, e, r) {
    e = n.defaultValue(e, 0);
    const o = i.Cartesian3.unpack(t, e, S);
    e += i.Cartesian3.packedLength;
    const a = i.Ellipsoid.unpack(t, e, L);
    e += i.Ellipsoid.packedLength;
    const s = p.VertexFormat.unpack(t, e, R);
    e += p.VertexFormat.packedLength;
    const l = t[e++],
      u = t[e++],
      m = t[e++],
      c = t[e++],
      y = t[e++],
      d = t[e++],
      f = t[e++],
      A = 1 === t[e++],
      x = t[e];
    return n.defined(r)
      ? ((r._center = i.Cartesian3.clone(o, r._center)),
        (r._ellipsoid = i.Ellipsoid.clone(a, r._ellipsoid)),
        (r._vertexFormat = p.VertexFormat.clone(s, r._vertexFormat)),
        (r._semiMajorAxis = l),
        (r._semiMinorAxis = u),
        (r._rotation = m),
        (r._stRotation = c),
        (r._height = y),
        (r._granularity = d),
        (r._extrudedHeight = f),
        (r._shadowVolume = A),
        (r._offsetAttribute = -1 === x ? void 0 : x),
        r)
      : ((j.height = y),
        (j.extrudedHeight = f),
        (j.granularity = d),
        (j.stRotation = c),
        (j.rotation = m),
        (j.semiMajorAxis = l),
        (j.semiMinorAxis = u),
        (j.shadowVolume = A),
        (j.offsetAttribute = -1 === x ? void 0 : x),
        new O(j));
  }),
    (O.computeRectangle = function (t, e) {
      const o = (t = n.defaultValue(t, n.defaultValue.EMPTY_OBJECT)).center,
        a = n.defaultValue(t.ellipsoid, i.Ellipsoid.WGS84),
        s = t.semiMajorAxis,
        l = t.semiMinorAxis,
        u = n.defaultValue(t.granularity, r.CesiumMath.RADIANS_PER_DEGREE);
      return D(o, s, l, n.defaultValue(t.rotation, 0), u, a, e);
    }),
    (O.createGeometry = function (t) {
      if (t._semiMajorAxis <= 0 || t._semiMinorAxis <= 0) return;
      const s = t._height,
        l = t._extrudedHeight,
        m = !r.CesiumMath.equalsEpsilon(s, l, 0, r.CesiumMath.EPSILON2);
      t._center = t._ellipsoid.scaleToGeodeticSurface(t._center, t._center);
      const p = {
        center: t._center,
        semiMajorAxis: t._semiMajorAxis,
        semiMinorAxis: t._semiMinorAxis,
        ellipsoid: t._ellipsoid,
        rotation: t._rotation,
        height: s,
        granularity: t._granularity,
        vertexFormat: t._vertexFormat,
        stRotation: t._stRotation,
      };
      let y;
      if (m)
        (p.extrudedHeight = l),
          (p.shadowVolume = t._shadowVolume),
          (p.offsetAttribute = t._offsetAttribute),
          (y = F(p));
      else if (
        ((y = (function (t) {
          const r = t.center;
          (P = i.Cartesian3.multiplyByScalar(
            t.ellipsoid.geodeticSurfaceNormal(r, P),
            t.height,
            P
          )),
            (P = i.Cartesian3.add(r, P, P));
          const n = new e.BoundingSphere(P, t.semiMajorAxis),
            a = o.EllipseGeometryLibrary.computeEllipsePositions(t, !0, !1),
            s = a.positions,
            l = a.numPts,
            u = G(s, t, !1);
          let m = N(l);
          return (
            (m = c.IndexDatatype.createTypedArray(s.length / 3, m)),
            { boundingSphere: n, attributes: u, indices: m }
          );
        })(p)),
        n.defined(t._offsetAttribute))
      ) {
        const e = y.attributes.position.values.length,
          i = t._offsetAttribute === u.GeometryOffsetAttribute.NONE ? 0 : 1,
          n = new Uint8Array(e / 3).fill(i);
        y.attributes.applyOffset = new a.GeometryAttribute({
          componentDatatype: r.ComponentDatatype.UNSIGNED_BYTE,
          componentsPerAttribute: 1,
          values: n,
        });
      }
      return new a.Geometry({
        attributes: y.attributes,
        indices: y.indices,
        primitiveType: a.PrimitiveType.TRIANGLES,
        boundingSphere: y.boundingSphere,
        offsetAttribute: t._offsetAttribute,
      });
    }),
    (O.createShadowVolume = function (t, e, i) {
      const r = t._granularity,
        n = t._ellipsoid,
        o = e(r, n),
        a = i(r, n);
      return new O({
        center: t._center,
        semiMajorAxis: t._semiMajorAxis,
        semiMinorAxis: t._semiMinorAxis,
        ellipsoid: n,
        rotation: t._rotation,
        stRotation: t._stRotation,
        granularity: r,
        extrudedHeight: o,
        height: a,
        vertexFormat: p.VertexFormat.POSITION_ONLY,
        shadowVolume: !0,
      });
    }),
    Object.defineProperties(O.prototype, {
      rectangle: {
        get: function () {
          return (
            n.defined(this._rectangle) ||
              (this._rectangle = D(
                this._center,
                this._semiMajorAxis,
                this._semiMinorAxis,
                this._rotation,
                this._granularity,
                this._ellipsoid
              )),
            this._rectangle
          );
        },
      },
      textureCoordinateRotationPoints: {
        get: function () {
          return (
            n.defined(this._textureCoordinateRotationPoints) ||
              (this._textureCoordinateRotationPoints = (function (t) {
                const e = -t._stRotation;
                if (0 === e) return [0, 0, 0, 1, 1, 0];
                const r = o.EllipseGeometryLibrary.computeEllipsePositions(
                    {
                      center: t._center,
                      semiMajorAxis: t._semiMajorAxis,
                      semiMinorAxis: t._semiMinorAxis,
                      rotation: t._rotation,
                      granularity: t._granularity,
                    },
                    !1,
                    !0
                  ).outerPositions,
                  n = r.length / 3,
                  s = new Array(n);
                for (let t = 0; t < n; ++t)
                  s[t] = i.Cartesian3.fromArray(r, 3 * t);
                const l = t._ellipsoid,
                  u = t.rectangle;
                return a.Geometry._textureCoordinateRotationPoints(s, e, l, u);
              })(this)),
            this._textureCoordinateRotationPoints
          );
        },
      },
    }),
    (t.EllipseGeometry = O);
});
