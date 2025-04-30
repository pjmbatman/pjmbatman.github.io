---
title: "⚙️ MML Chapter 7: 최적화 (Optimization)"
date: 2025-04-06
tags: [MML, 최적화, 경사하강법, 라그랑주, 볼록함수, 머신러닝수학]
categories: [Study, Mathematics for Machine Learning]
math: true
---

# 📘 MML Study - Chapter 7: Optimization 요약

> 본 장에서는 머신러닝 모델의 **학습 및 파라미터 조정의 수학적 핵심**인 최적화 이론을 다룬다.  
> 경사하강법, 제약조건하 최적화, 볼록 최적화 등의 주제를 다루며, 실질적인 학습 알고리즘 설계에 필수적인 내용들을 제공한다.

---

## 📚 목차

- 7.1 [경사하강법 (Gradient Descent)](#7.1)
- 7.2 [제약 최적화와 라그랑주 승수법 (Constrained Optimization)](#7.2)
- 7.3 [볼록 최적화 (Convex Optimization)](#7.3)
- 7.4 [참고자료 (Further Reading)](#7.4)

---

## 7.1 경사하강법 (Gradient Descent) <a name="7.1"/>

- **정의 (What):**  
  함수의 기울기를 이용하여 값이 가장 작아지는 방향으로 반복 이동하며 최소값을 찾는 알고리즘

- **의의 (Why):**  
  대부분의 머신러닝 학습은 손실함수 최소화이며, 이에 대한 대표적인 수치적 접근 방법이 경사하강법이다.

- **활용 시점 (When):**  
  - 손실 함수 최소화  
  - 뉴럴넷 학습  
  - 비선형 회귀 문제 최적화

- **방법 (How):**  
  $$
  x_{t+1} = x_t - \gamma \nabla f(x_t)
  $$  
  - 학습률 $\gamma$ 조절 필요  
  - 모멘텀(momentum), Adam 등의 변형 사용 가능  
  - 스토캐스틱 경사하강법(SGD): 전체가 아닌 일부 데이터만 이용하여 추정

> ⛰️ **콜아웃**  
> 경사하강법은 **단순하지만 강력한** 알고리즘이다. 단, 초기화와 학습률 설정에 민감하다

---

## 7.2 제약 최적화와 라그랑주 승수법 <a name="7.2"/>

- **정의 (What):**  
  주어진 함수의 최소값을 구할 때, 특정 제약조건을 만족해야 하는 문제. 라그랑주 승수는 이러한 제약조건을 처리하는 수단

- **의의 (Why):**  
  SVM, 강화학습 등에서는 제약조건을 가진 최적화가 빈번히 등장함

- **활용 시점 (When):**  
  - 제한된 자원 하의 최적화  
  - 라그랑주 이중 문제(Dual Problem) 구성  
  - 서포트 벡터 머신 최적화

- **방법 (How):**  
  $$  
  \mathcal{L}(x, \lambda) = f(x) + \lambda^\top g(x)  
  $$  
  - $\lambda$: 제약 함수에 대한 라그랑주 승수  
  - 듀얼 문제: $\max_{\lambda \ge 0} \min_x \mathcal{L}(x, \lambda)$

> 🔐 **콜아웃**  
> 라그랑주 승수는 **제약조건을 포함한 목적함수**로 문제를 재정의하여 해를 유도한다

---

## 7.3 볼록 최적화 (Convex Optimization) <a name="7.3"/>

- **정의 (What):**  
  목적함수와 제약조건이 모두 볼록(convex) 함수인 최적화 문제

- **의의 (Why):**  
  볼록 문제는 **국소해 = 전역해**라는 강력한 이론적 보장을 제공함

- **활용 시점 (When):**  
  - SVM, 로지스틱 회귀  
  - LASSO, Ridge regression  
  - 정규화 기반 학습

- **방법 (How):**  
  - 볼록함수의 성질:  
    $$
    f(\theta x + (1-\theta) y) \le \theta f(x) + (1-\theta)f(y)
    $$  
  - 이중성(Duality), 서브그래디언트 방법 등 적용 가능

> 📈 **콜아웃**  
> 볼록 최적화는 **이론과 실용성 모두를 보장하는 영역**이며, 머신러닝 대부분의 기본이 된다.

---

## 7.4 참고자료 (Further Reading) <a name="7.4"/>

- 📘 **서적**
  - *Convex Optimization* — Stephen Boyd & Lieven Vandenberghe  
  - *Numerical Optimization* — Jorge Nocedal & Stephen J. Wright

- 🎥 **강의**
  - Stanford CS229 — Optimization Lecture  
  - YouTube: Convex Optimization by Boyd

---

✅ 다음 장인 **[Chapter 8: 모델과 데이터의 만남 (When Models Meet Data)]**에서는 학습의 본질인 **경험 위험 최소화, 최대우도 추정, 확률적 모델링** 등을 통해 이론을 실제 학습문제에 연결하는 방법을 다룬다.
