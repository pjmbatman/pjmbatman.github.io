---
title: "🔍 MML Chapter 4: 행렬 분해 (Matrix Decompositions)"
date: 2025-04-03
tags: [MML, 행렬분해, 선형대수, SVD, 고유값, 머신러닝수학]
categories: [Study, Mathematics for Machine Learning]
math: true
---

# 📘 MML Study - Chapter 4: Matrix Decompositions 요약

> 이 장에서는 행렬을 보다 효율적으로 분석하고, **모델 해석, 차원 축소, 데이터 압축** 등에 유용한 여러 종류의 행렬 분해 기법들을 소개한다.  
> 특히, **행렬식(determinant), 고유값 분해(eigendecomposition), 특이값 분해(SVD)** 등은 선형 변환의 구조를 이해하고 데이터를 축약하는 데 필수적인 도구들이다.

---

## 📚 목차

- 4.1 [행렬식과 트레이스 (Determinant and Trace)](#4.1)
- 4.2 [고유값과 고유벡터 (Eigenvalues and Eigenvectors)](#4.2)
- 4.3 [Cholesky 분해](#4.3)
- 4.4 [고유값 분해와 대각화](#4.4)
- 4.5 [특이값 분해 (Singular Value Decomposition, SVD)](#4.5)
- 4.6 [행렬 근사 (Matrix Approximation)](#4.6)
- 4.7 [행렬 분류도 (Matrix Taxonomy)](#4.7)
- 4.8 [참고자료 (Further Reading)](#4.8)

---

## 4.1 행렬식과 트레이스 (Determinant and Trace) <a name="4.1"/>

- **정의 (What):**  
  행렬식은 정사각행렬의 성질을 나타내는 수치적 요약으로, 그 값이 0이 아니면 역행렬이 존재함을 의미한다. 트레이스는 대각 성분의 합이다.

- **의의 (Why):**  
  선형 시스템의 해 유무 판별, 선형변환의 부피 보존 여부 등 다양한 해석을 가능케 한다.

- **활용 시점 (When):**  
  - 역행렬 존재 여부 판정  
  - 고유값의 합 = 트레이스  
  - 선형 변환의 부피 변화 측정

- **방법 (How):**  
  - 2x2 행렬: $\det(A) = a_{11}a_{22} - a_{12}a_{21}$  
  - $\text{tr}(A) = \sum_i a_{ii}$  
  - 가우스 소거법과 삼각 행렬을 통한 계산  

> 📐 **콜아웃**  
> $\det(A) = 0$ ⇨ 선형독립 X ⇨ 역행렬 없음 ⇨ 차원 축소 발생 가능

---

## 4.2 고유값과 고유벡터 (Eigenvalues and Eigenvectors) <a name="4.2"/>

- **정의 (What):**  
  $Ax = \lambda x$를 만족하는 $\lambda$를 고유값, $x$를 고유벡터라 한다.

- **의의 (Why):**  
  선형 변환에서 불변 방향 및 크기 비율을 제공하며, 분해 및 축소에서 핵심 개념이다.

- **활용 시점 (When):**  
  - PCA, 스펙트럴 클러스터링  
  - 다변량 통계, 해석 모델  
  - 대각화 가능성 판단

- **방법 (How):**  
  - $\det(A - \lambda I) = 0$ ⇒ 특성 방정식  
  - 고유벡터는 해 공간: $(A - \lambda I)x = 0$

> 🎯 **콜아웃**  
> 고유값은 '축소 혹은 확장 비율'이며, 고유벡터는 '불변 방향'이다.

---

## 4.3 Cholesky 분해 <a name="4.3"/>

- **정의 (What):**  
  대칭이며 양의 정부호인 행렬을 $A = LL^\top$으로 분해하는 방식

- **의의 (Why):**  
  계산 효율성이 높고, 확률분포 샘플링 및 최적화에서 자주 사용됨

- **활용 시점 (When):**  
  - 가우시안 샘플링  
  - 베이지안 모델  
  - 역행렬 계산 간소화

- **방법 (How):**  
  - $L$은 하삼각 행렬이며, 각 요소는 반복적으로 계산됨

> 🧮 **콜아웃**  
> Variational Autoencoder에서도 **재매개변수화 트릭** 구현 시 핵심

---

## 4.4 고유값 분해와 대각화 (Eigendecomposition and Diagonalization) <a name="4.4"/>

- **정의 (What):**  
  $A = PDP^{-1}$ 형태로 분해되며, $D$는 고유값으로 구성된 대각행렬, $P$는 고유벡터

- **의의 (Why):**  
  선형 시스템을 단순화하고, 계산 복잡도 감소에 기여함

- **활용 시점 (When):**  
  - 선형 동역학 해석  
  - 반복 연산 최적화  
  - 기저 변환

- **방법 (How):**  
  - $A$가 고유벡터 집합으로 기저 구성 가능하면 대각화 가능

> 🔎 **콜아웃**  
> 반복된 고유값이 존재해도 **고유벡터 수가 충분하지 않으면** 대각화 불가!

---

## 4.5 특이값 분해 (SVD, Singular Value Decomposition) <a name="4.5"/>

- **정의 (What):**  
  $A = U\Sigma V^\top$ 형태의 분해. 모든 형태의 행렬에 적용 가능

- **의의 (Why):**  
  데이터 압축, 잡음 제거, 추천 시스템 등에 광범위하게 사용됨

- **활용 시점 (When):**  
  - 차원 축소 (LSA, PCA)  
  - 이미지 압축  
  - 추천 시스템의 사용자-아이템 행렬 해석

- **방법 (How):**  
  - $U$: 좌측 특이벡터, $V$: 우측 특이벡터, $\Sigma$: 특이값 대각행렬  
  - $\text{rank-k}$ 근사: 상위 $k$개의 특이값만 유지

> 💡 **콜아웃**  
> 모든 행렬에 대해 **항상 존재**한다는 점에서 가장 일반적이면서도 강력한 분해 방법

---

## 4.6 행렬 근사 (Matrix Approximation) <a name="4.6"/>

- **정의 (What):**  
  원래 행렬 $A$를 $k$개의 특이값/고유값만을 사용하여 근사화하는 방식

- **의의 (Why):**  
  노이즈 제거 및 계산 효율화, 구조적 데이터 추출 가능

- **활용 시점 (When):**  
  - 희소 행렬 처리  
  - 협업 필터링  
  - 데이터 압축

- **방법 (How):**  
  - $\hat{A}^{(k)} = \sum_{i=1}^k \sigma_i u_i v_i^\top$

> 🧩 **콜아웃**  
> 랭크-1 근사만으로도 **데이터 내 구조적인 패턴**을 효과적으로 설명 가능

---

## 4.7 행렬 분류도 (Matrix Taxonomy) <a name="4.7"/>

- **정의 (What):**  
  행렬의 다양한 성질과 그 관계를 체계적으로 정리한 트리 구조

- **의의 (Why):**  
  행렬의 분해 가능성, 특성 파악, 적합한 연산 선택 등에 도움

- **활용 시점 (When):**  
  - 정규성, 대각화 여부 판단  
  - 알고리즘 선택 기준 마련  
  - 행렬 해석 최적화

> 🧠 **콜아웃**  
> 직관적 시각화를 통해 '행렬의 계보'를 이해하고, 적절한 연산 전략을 세울 수 있다.

---

## 4.8 참고자료 (Further Reading) <a name="4.8"/>

- 📘 **서적**
  - *Linear Algebra Done Right* — Sheldon Axler  
  - *Matrix Computations* — Gene H. Golub & Charles F. Van Loan

- 🎥 **강의/영상**
  - Gilbert Strang (MIT OCW) — Linear Algebra  
  - 3Blue1Brown — “The Essence of Linear Algebra” 시리즈

---

✅ 다음 장인 **[Chapter 5: 벡터 미적분학 (Vector Calculus)]**에서는 머신러닝의 핵심 최적화 수단인 **미분 연산**을 다루며, **기울기, 야코비안, 헤시안** 등 모델 최적화에 필수적인 도구들을 소개할 예정이다.
