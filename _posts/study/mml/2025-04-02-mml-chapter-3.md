---
title: "📐 MML Chapter 3: 해석기하학 (Analytic Geometry)"
date: 2025-04-02
tags: [MML, 해석기하학, 벡터기하학, 머신러닝수학, 내적, 정사영]
categories: [Study, Mathematics for Machine Learning]
math: true
---

# 📘 MML Study - Chapter 3: Analytic Geometry 요약

> 이 장에서는 벡터의 길이, 거리, 각도와 같은 **기하학적 직관**을 수학적으로 다루며, 머신러닝 모델에서 유사성, 투영, 회전 등 핵심 개념의 기초가 되는 내용을 설명한다.  
> 특히 **내적, 정사영, 직교성** 개념은 PCA, 회귀, SVM 등 머신러닝 기법에 폭넓게 활용된다.

---

## 📚 목차

- 3.1 [Norm (놈)](#3.1)
- 3.2 [Inner Product (내적)](#3.2)
- 3.3 [Lengths and Distances (벡터의 길이와 거리)](#3.3)
- 3.4 [Angles and Orthogonality (각도와 직교성)](#3.4)
- 3.5 [Orthonormal Basis (직교정규 기저)](#3.5)
- 3.6 [Orthogonal Complement (직교 여공간)](#3.6)
- 3.7 [Function Inner Product (함수 공간의 내적)](#3.7)
- 3.8 [Orthogonal Projections (직교 정사영)](#3.8)
- 3.9 [Rotations (회전)](#3.9)
- 3.10 [참고자료 (Further Reading)](#3.10)

---

## 3.1 Norm (놈) <a name="3.1"/>

- **정의 (What):**  
  벡터의 "길이" 또는 "크기"를 수치적으로 측정하는 함수로, $\|x\|$로 표기한다.

- **의의 (Why):**  
  데이터 간의 크기 비교, 유사도 계산, 정규화 등에 사용된다.

- **활용 시점 (When):**  
  - L1, L2 정규화  
  - 거리 기반 분류기 (e.g., K-NN)  
  - 신경망 weight regularization

- **방법 (How):**  
  - L2 놈: $\|x\|_2 = \sqrt{x^\top x}$  
  - L1 놈: $\|x\|_1 = \sum_i |x_i|$  

> 📏 **콜아웃**  
> 머신러닝에서는 보통 L2 놈(유클리드 거리)이 기본이며, 희소성(sparsity)을 유도할 경우 L1 놈을 활용한다.

---

## 3.2 Inner Product (내적) <a name="3.2"/>

- **정의 (What):**  
  두 벡터 간의 유사도를 수치화하는 연산으로, 보통 $\langle x, y \rangle = x^\top y$로 표현된다.

- **의의 (Why):**  
  각도 계산, 정사영, 거리 정의, 회귀와 SVM 등에서 핵심적인 연산이다.

- **활용 시점 (When):**  
  - 유사도 기반 분류  
  - 커널 함수 (SVM, 커널 PCA)  
  - 직교성 판단

- **방법 (How):**  
  - $\langle x, y \rangle = \sum x_i y_i$  
  - 조건: 선형성, 대칭성, 양의정부호성  

> 🧠 **콜아웃**  
> 내적은 "곱"이 아니라 **구조를 갖춘 유사도**이다. 내적이 존재하면 거리와 각도를 정의할 수 있다.

---

## 3.3 Lengths and Distances (벡터의 길이와 거리) <a name="3.3"/>

- **정의 (What):**  
  길이는 벡터의 norm이며, 거리는 두 벡터의 차의 norm이다.

- **의의 (Why):**  
  벡터 간의 차이를 수치화하며, 지도학습·비지도학습에서 거리 기반 접근법의 기반이다.

- **활용 시점 (When):**  
  - 최근접 이웃  
  - 클러스터링 (e.g., K-means)  
  - 손실 함수 정의

- **방법 (How):**  
  - 거리: $d(x, y) = \|x - y\|$  
  - 유클리드 거리, 마할라노비스 거리 등

> 📐 **콜아웃**  
> 거리 정의는 선택한 **내적/놈**에 따라 달라진다. 내적은 유사도를, 거리(metric)는 차이를 나타낸다.

---

## 3.4 Angles and Orthogonality (각도와 직교성) <a name="3.4"/>

- **정의 (What):**  
  두 벡터 간의 각도는 내적을 통해 정의되며, 내적이 0이면 직교(orthogonal)하다.

- **의의 (Why):**  
  독립성, 차원 분리성, 해석력 등을 파악하는 데 활용된다.

- **활용 시점 (When):**  
  - PCA의 주성분 간 직교성  
  - SVM의 결정 경계  
  - 회귀 오차 직교 조건

- **방법 (How):**  
  - 각도: $\cos \omega = \frac{\langle x, y \rangle}{\|x\|\|y\|}$  
  - 직교 조건: $\langle x, y \rangle = 0$

> 🔍 **콜아웃**  
> 내적이 0이면 방향이 완전히 다르다 = 정보가 중복되지 않는다.

---

## 3.5 Orthonormal Basis (직교정규 기저) <a name="3.5"/>

- **정의 (What):**  
  서로 직교하고 길이가 1인 벡터로 구성된 기저

- **의의 (Why):**  
  좌표계의 간결성, 계산의 효율성 확보

- **활용 시점 (When):**  
  - 기저 변환  
  - 그람-슈미트 정규화  
  - 선형모델 해 계산

- **방법 (How):**  
  - $\langle b_i, b_j \rangle = \delta_{ij}$ (크로네커 델타)

> 🧮 **콜아웃**  
> 직교정규 기저를 사용하면 **계산의 안정성**과 **직관적 해석**이 용이해진다.

---

## 3.6 Orthogonal Complement (직교 여공간) <a name="3.6"/>

- **정의 (What):**  
  벡터 공간 $V$에서 부분공간 $U$에 직교하는 모든 벡터의 집합

- **의의 (Why):**  
  정사영, 차원 분해, 오차 해석 등 다양한 분석에 사용됨

- **활용 시점 (When):**  
  - 정사영 계산  
  - 잔차 공간 분석  
  - 선형 시스템 해석

- **방법 (How):**  
  - $U^\perp = \{ v \in V \mid \forall u \in U, \langle v, u \rangle = 0 \}$

> ➕ **콜아웃**  
> 전체 공간은 $U \oplus U^\perp$로 분해 가능. 모든 벡터는 부분공간과 그 여공간으로 나뉜다.

---

## 3.7 Inner Product of Functions (함수 공간의 내적) <a name="3.7"/>

- **정의 (What):**  
  함수 $f, g$ 간 내적은 적분으로 정의됨: $\langle f, g \rangle = \int f(x) g(x) dx$

- **의의 (Why):**  
  함수 간 유사도 측정, 푸리에 해석, 가우시안 프로세스 등에 활용

- **활용 시점 (When):**  
  - 커널 방법  
  - 함수 근사 (Fourier, GP)  
  - 정규 직교 함수 집합 구성

- **방법 (How):**  
  - 예: $\langle \sin(x), \cos(x) \rangle = 0$ (직교)

> 📊 **콜아웃**  
> 함수도 벡터처럼 다룰 수 있다. 무한차원 공간에서의 벡터 해석!

---

## 3.8 Orthogonal Projections (직교 정사영) <a name="3.8"/>

- **정의 (What):**  
  벡터를 부분공간에 가장 가깝게 "떨어뜨리는" 연산으로, 직교 조건을 만족

- **의의 (Why):**  
  회귀 해석, PCA, 최적화 등에서 핵심 역할 수행

- **활용 시점 (When):**  
  - 최소제곱 해 (Least Squares)  
  - 차원 축소  
  - 오류 분석

- **방법 (How):**  
  - 직교 정사영: $P_U(x) = UU^\top x$ (정규 직교 기저 $U$ 기준)

> 🎯 **콜아웃**  
> 회귀해는 $b$를 컬럼공간에 **정사영**한 점이다!

---

## 3.9 Rotations (회전) <a name="3.9"/>

- **정의 (What):**  
  벡터 공간 내에서 길이와 각도를 보존하며 회전시키는 선형 변환

- **의의 (Why):**  
  좌표계 변환, 기저 회전, 데이터 회전에 사용됨

- **활용 시점 (When):**  
  - PCA  
  - 이미지 회전  
  - 로봇공학, 물리 시뮬레이션

- **방법 (How):**  
  - 2차원 회전 행렬:
    $$
    R(θ) =
    \begin{bmatrix}
    \cosθ & -\sinθ \\
    \sinθ & \cosθ
    \end{bmatrix}
    $$

> 🌀 **콜아웃**  
> 회전은 **길이와 각도**를 그대로 보존하는 유일한 변환이다.

---

## 3.10 참고자료 (Further Reading) <a name="3.10"/>

- 📘 **서적**
  - *Linear Algebra Done Right* — Sheldon Axler  
  - *Convex Optimization* — Boyd & Vandenberghe  

- 🎥 **강의/영상**
  - 3Blue1Brown – "Essence of Linear Algebra"  
  - MIT OCW – Strang 교수 강의

---

✅ 다음 장은 [Chapter 4: 행렬 분해 (Matrix Decompositions)]으로, 행렬의 구조를 분해하고 해석하는 방법론에 대해 다룬다.  
🔍 **데이터 구조 분석 및 차원축소, 회귀, 특이값 분해** 등을 다룰 준비를 하자.
