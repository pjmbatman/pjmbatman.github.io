---
title: "🧮 MML Chapter 5: 벡터 미적분학 (Vector Calculus)"
date: 2025-04-04
tags: [MML, 벡터미적분, Gradient, Jacobian, Hessian, 머신러닝수학]
categories: [Study, Mathematics for Machine Learning]
math: true
---

# 📘 MML Study - Chapter 5: Vector Calculus 요약

> 본 장에서는 머신러닝 모델의 학습과 최적화에 필수적인 **도함수, 그래디언트, 야코비안, 헤시안, 체인 룰, 테일러 전개** 등을 다룬다.  
> 이 개념들은 대부분의 모델이 학습 시 사용하는 **오차 역전파 (Backpropagation)** 알고리즘 및 **최적화 루틴**의 기반을 이룬다.

---

## 📚 목차

- 5.1 [일변수 함수의 미분 (Differentiation of Univariate Functions)](#5.1)
- 5.2 [부분 미분과 그래디언트 (Partial Derivatives and Gradients)](#5.2)
- 5.3 [벡터값 함수의 그래디언트 (Gradients of Vector-Valued Functions)](#5.3)
- 5.4 [행렬의 미분 (Matrix Derivatives)](#5.4)
- 5.5 [그래디언트 계산 항등식 (Gradient Identities)](#5.5)
- 5.6 [역전파와 자동 미분 (Backpropagation and Automatic Differentiation)](#5.6)
- 5.7 [고계 도함수 (Higher-Order Derivatives)](#5.7)
- 5.8 [선형화 및 다변수 테일러 전개 (Linearization and Taylor Series)](#5.8)
- 5.9 [참고자료 (Further Reading)](#5.9)

---

## 5.1 일변수 함수의 미분 <a name="5.1"/>

- **정의 (What):**  
  평균 변화율(차분 몫, difference quotient)을 극한을 통해 접선의 기울기로 정의한 함수의 도함수

- **의의 (Why):**  
  함수의 증감 추세를 수치화하고, 최적화에서 함수의 경향성을 파악하는 데 사용됨

- **활용 시점 (When):**  
  - 학습 오차의 감소율 파악  
  - 최적화 알고리즘 설계  
  - 기초적인 함수 분석

- **방법 (How):**  
  $$
  \frac{df}{dx} = \lim_{h \to 0} \frac{f(x + h) - f(x)}{h}
  $$

> 💡 **콜아웃**  
> 머신러닝에서는 편미분과 그래디언트로 확장되며, 스칼라 함수의 변화 방향을 나타낸다.

---

## 5.2 부분 미분과 그래디언트 <a name="5.2"/>

- **정의 (What):**  
  다변수 함수의 각 변수에 대한 미분. 그래디언트는 모든 편미분을 벡터로 정리한 것

- **의의 (Why):**  
  최적화에서 함수의 기울기를 이용해 파라미터를 조정하며, 학습 속도와 방향을 결정

- **활용 시점 (When):**  
  - 경사 하강법 (GD)  
  - 손실 함수 최소화  
  - 뉴럴넷 학습

- **방법 (How):**  
  $$
  \nabla f(x) = \left[ \frac{\partial f}{\partial x_1}, \cdots, \frac{\partial f}{\partial x_n} \right]^\top
  $$

> 🧭 **콜아웃**  
> 그래디언트는 함수의 **가장 가파른 증가 방향**을 가리킨다.

---

## 5.3 벡터값 함수의 그래디언트 <a name="5.3"/>

- **정의 (What):**  
  벡터를 입력받고 벡터를 출력하는 함수의 미분. 결과는 **야코비안 행렬 (Jacobian)**

- **의의 (Why):**  
  다층 뉴럴넷의 연산, 체인 룰 적용, 입력-출력 간 민감도 분석에 필수

- **활용 시점 (When):**  
  - 역전파 알고리즘  
  - 다변량 함수 근사  
  - 벡터 필드 해석

- **방법 (How):**  
  $$
  J_{ij} = \frac{\partial f_i}{\partial x_j}
  $$

> 🔍 **콜아웃**  
> 야코비안은 **벡터 함수의 변화율 전체**를 행렬 형태로 나타낸 것이다.

---

## 5.4 행렬의 미분 <a name="5.4"/>

- **정의 (What):**  
  행렬 함수를 변수에 대해 미분하는 것으로, 결과는 텐서 또는 여러 야코비안의 결합 형태

- **의의 (Why):**  
  벡터 미분의 확장이며, 행렬 계산을 자동 미분 시스템에 적용 가능하게 함

- **활용 시점 (When):**  
  - 행렬 기반 손실 함수  
  - 딥러닝 레이어별 파라미터 미분  
  - 고차원 함수 최적화

- **방법 (How):**  
  규칙 기반 미분 항등식을 활용 (예: $d(AX) = AdX$)

> 🧮 **콜아웃**  
> 행렬 미분은 **선형대수 + 미적분의 융합**이다. 야코비안의 축적이 핵심.

---

## 5.5 그래디언트 계산 항등식 <a name="5.5"/>

- **정의 (What):**  
  곱셈, 나눗셈, 합성 등 연산에 대한 미분 규칙

- **의의 (Why):**  
  복잡한 함수의 미분을 효율적으로 계산하기 위해 필요

- **활용 시점 (When):**  
  - 수식 유도 간소화  
  - 백엔드 자동 미분 엔진 구현  
  - 파이썬, TensorFlow 등 프레임워크 활용 시

- **방법 (How):**  
  - 곱의 법칙: $(fg)' = f'g + fg'$  
  - 합성 함수: $(g \circ f)' = g'(f(x))f'(x)$

> 🧩 **콜아웃**  
> 딥러닝의 **역전파(backprop)**는 체인 룰을 반복 적용한 결과이다.

---

## 5.6 역전파와 자동 미분 <a name="5.6"/>

- **정의 (What):**  
  복합 함수의 그래디언트를 계산하는 알고리즘으로, 체인 룰을 기반으로 한다.

- **의의 (Why):**  
  딥러닝 모델 학습의 핵심. 그래디언트 계산을 정확하고 빠르게 수행

- **활용 시점 (When):**  
  - 뉴럴넷 학습  
  - 최적화 루프  
  - 프레임워크 내부 연산 (TensorFlow, PyTorch)

- **방법 (How):**  
  $$
  \frac{dL}{dx} = \frac{dL}{dz} \cdot \frac{dz}{dx}
  $$

> 🔁 **콜아웃**  
> 역전파는 **출력 → 입력 방향**으로 그래디언트를 전파하는 알고리즘이다.

---

## 5.7 고계 도함수 (Higher-Order Derivatives) <a name="5.7"/>

- **정의 (What):**  
  도함수를 한 번 더 미분한 것. 두 번째 미분은 특히 **헤시안(Hessian)**이라 불린다.

- **의의 (Why):**  
  최적화의 곡률 분석, 뉴런 민감도 분석 등에 사용됨

- **활용 시점 (When):**  
  - 뉴턴 방법  
  - 손실 함수의 최소화  
  - 비선형 근사 분석

- **방법 (How):**  
  $$
  H_{ij} = \frac{\partial^2 f}{\partial x_i \partial x_j}
  $$

> 📐 **콜아웃**  
> 헤시안 행렬은 **로컬 곡률** 정보를 담고 있다. convex/concave 여부 판단에 사용됨.

---

## 5.8 선형화 및 다변수 테일러 전개 <a name="5.8"/>

- **정의 (What):**  
  함수의 주어진 점 근처에서 선형 혹은 고차 다항식으로 근사

- **의의 (Why):**  
  복잡한 함수의 로컬 근사, 수치 해석, 최적화 초기화에 유용

- **활용 시점 (When):**  
  - 뉴턴-랩슨 방법  
  - 근사 기반 예측  
  - 다항 회귀 모델

- **방법 (How):**  
  $$
  f(x) \approx f(x_0) + \nabla f(x_0)^\top (x - x_0)
  $$

> 🧠 **콜아웃**  
> 선형화는 **비선형 함수도 국소적으로는 선형처럼** 다룰 수 있다는 강력한 도구이다.

---

## 5.9 참고자료 (Further Reading) <a name="5.9"/>

- 📘 **서적**
  - *Calculus* by Michael Spivak  
  - *Matrix Cookbook* (기호 및 미분 공식 정리)  

- 🎥 **강의**
  - MIT OCW — Gilbert Strang’s Calculus 강의  
  - YouTube: 3Blue1Brown “The Essence of Calculus”

---

✅ 다음 장인 **[Chapter 6: 확률과 분포 (Probability and Distributions)]**에서는 머신러닝 모델의 불확실성과 데이터를 수리적으로 해석하기 위한 **확률론의 핵심 개념들**을 다룬다.  
🎲 **우연성과 정보**를 수학으로 다루는 여정을 시작해보자.
