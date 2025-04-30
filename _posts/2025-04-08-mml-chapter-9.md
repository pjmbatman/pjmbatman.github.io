---
title: "📈 MML Chapter 9: 선형 회귀 (Linear Regression)"
date: 2025-04-08
tags: [MML, 선형회귀, 회귀분석, 베이지안회귀, 머신러닝수학]
categories: [Study, Mathematics for Machine Learning]
math: true
---

# 📘 MML Study - Chapter 9: Linear Regression 요약

> 본 장에서는 머신러닝의 핵심 지도학습 문제 중 하나인 **선형 회귀(linear regression)**를 수학적으로 해석한다.  
> 최대우도 추정(MLE), 최대 사후 확률 추정(MAP), 베이지안 회귀까지 확장하여 **모델 적합, 일반화, 불확실성 정량화**를 함께 다룬다.

---

## 📚 목차

- 9.1 [문제 정의와 회귀 설정](#9.1)
- 9.2 [최대우도 추정 (MLE)](#9.2)
- 9.3 [최대사후확률 추정 (MAP)](#9.3)
- 9.4 [베이지안 선형회귀](#9.4)
- 9.5 [정규화와 모델 선택](#9.5)
- 9.6 [참고자료 (Further Reading)](#9.6)

---

## 9.1 문제 정의와 회귀 설정 <a name="9.1"/>

- **What:**  
  입력 $x \in \mathbb{R}^D$와 대응하는 관측값 $y \in \mathbb{R}$ 간의 관계를 모델링

- **Why:**  
  연속적인 값을 예측하고자 할 때 가장 기본이 되는 접근법이며, 해석력과 구현 용이성이 뛰어남

- **When:**  
  - 수요 예측, 가격 예측 등 연속값 타겟 예측  
  - 시스템 식별, 강화학습의 모델 기반 구성  
  - 신호처리, 최적화, 시계열 분석 등

- **How:**  
  $$
  y = x^\top \theta + \epsilon, \quad \epsilon \sim \mathcal{N}(0, \sigma^2)
  $$  
  즉, 입력 $x$에 대해 선형 모델 + 가우시안 잡음을 가정&#8203;:contentReference[oaicite:0]{index=0}.

> 📐 **콜아웃**  
> 회귀는 '곡선 그리기'가 아니라 **함수 근사와 예측 일반화**에 관한 수학적 문제이다.

---

## 9.2 최대우도 추정 (Maximum Likelihood Estimation) <a name="9.2"/>

- **What:**  
  관측 데이터를 가장 잘 설명하는 파라미터 $\theta$를 찾는 방법

- **Why:**  
  손실 함수 최소화와 직접 연결되며, 일반적인 머신러닝 최적화 문제의 시작점

- **When:**  
  - 선형 회귀  
  - 통계적 모델 추정  
  - 로그우도 기반 손실 최소화

- **How:**  
  $$
  \theta_{ML} = \arg\min_\theta \|y - X\theta\|^2
  $$  
  $$
  \Rightarrow \theta_{ML} = (X^\top X)^{-1} X^\top y
  $$

> 🧠 **콜아웃**  
> 최소제곱해와 동일하며, **정사영 해석**과 연결된다&#8203;:contentReference[oaicite:1]{index=1}.

---

## 9.3 최대사후확률 추정 (MAP) <a name="9.3"/>

- **What:**  
  파라미터에 대한 사전확률(prior)을 반영하여 추정값을 보완하는 방식

- **Why:**  
  데이터가 부족하거나 과적합이 우려될 때, 사전 지식 활용을 통해 강건한 학습 가능

- **When:**  
  - 정규화 회귀 (Ridge Regression)  
  - 사전 분포가 있는 베이즈 모델  
  - 신뢰성 높은 추정이 필요한 경우

- **How:**  
  사전: $\theta \sim \mathcal{N}(0, \tau^2 I)$ 가정  
  MAP 해:
  $$
  \theta_{MAP} = \arg\min_\theta \|y - X\theta\|^2 + \frac{\sigma^2}{\tau^2} \|\theta\|^2
  $$

> 📎 **콜아웃**  
> MAP는 **L2 정규화된 최소제곱**과 수학적으로 동일하다. 정규화는 사전의 역할.

---

## 9.4 베이지안 선형회귀 <a name="9.4"/>

- **What:**  
  파라미터를 고정된 값이 아닌 확률변수로 두고, 사후분포를 계산하여 불확실성까지 추론

- **Why:**  
  예측값의 신뢰 구간, 불확실성 추론이 가능하며 **결정적 추정 → 분포적 추론**으로 확장

- **When:**  
  - 예측 신뢰도 포함할 때  
  - 불확실성 기반 의사결정  
  - 베이지안 최적화 등

- **How:**  
  사후분포:
  $$
  p(\theta|X, y) \propto p(y|X, \theta)p(\theta)
  $$  
  예측분포:
  $$
  p(y^*|x^*, X, y) = \int p(y^*|x^*, \theta)p(\theta|X, y) d\theta
  $$

> 🎯 **콜아웃**  
> 베이지안 회귀는 **단일 예측값이 아닌 분포 자체를 추론**하며, 신뢰 구간까지 제공한다&#8203;:contentReference[oaicite:2]{index=2}.

---

## 9.5 정규화와 모델 선택 <a name="9.5"/>

- **What:**  
  과적합 방지를 위한 정규화, 다양한 손실 함수, 사전 분포의 선택

- **Why:**  
  실제 데이터는 항상 불완전하고, 모델 선택이 결과에 큰 영향을 미친다

- **When:**  
  - 데이터 수가 적은 경우  
  - 다항 회귀 등 고차 모델 사용 시  
  - 하이퍼파라미터 튜닝

- **How:**  
  - 정규화 항: $\lambda \|\theta\|^2$ 또는 $\|\theta\|_1$  
  - 모델 평가 기준: AIC, BIC  
  - 교차검증, 베이지안 증거 비교

> 🧩 **콜아웃**  
> 회귀 모델도 결국은 선택의 문제. **복잡도 vs 성능**의 균형이 핵심이다&#8203;:contentReference[oaicite:3]{index=3}.

---

## 9.6 참고자료 (Further Reading) <a name="9.6"/>

- 📘 **서적**
  - *The Elements of Statistical Learning* — Hastie, Tibshirani, Friedman  
  - *Bayesian Reasoning and Machine Learning* — David Barber

- 🎥 **강의**
  - Stanford CS229 — Linear Regression  
  - YouTube: StatQuest "Linear Models Explained"

---

✅ 다음 장인 **[Chapter 10: 차원 축소 (Dimensionality Reduction)]**에서는 고차원 데이터를 보다 간결하게 표현하는 PCA 및 관련 기법들을 다룬다.  
🧭 **데이터 압축, 패턴 발견, 시각화**를 위한 핵심 개념을 만나보자.
