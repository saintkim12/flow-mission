/* global localforage */
// eslint-disable-next-line no-extra-semi
;(function (global, factory) { typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) : typeof define === 'function' && define.amd ? define(['exports'], factory) : (global = global || self, factory(global['WithoutServer'] = {})) }(this, (function WithoutServer(exports) {'use strict'
  // umd 패턴으로 WithoutServer 모듈 리턴

  /* validation */
  /**
   * 확장자 값을 파싱 처리
   * @param rawExt {string}
   */
  function getParsedExt(rawExt) {
    const ext = rawExt
      ?.trim?.() // trim 처리
      ?.toLowerCase?.() // 소문자 처리
      // FIXME: 추가 변환 처리
    return ext
  }
  /**
   * 확장자가 유효한 값인지 확인
   * @param ext {string}
   * @returns o {object}
   * @returns o.result {boolean}
   * @returns o.message {string | undefined}
   */
  async function isValidExt(ext) {
    try {
      let message = undefined
      if (!ext || typeof ext !== 'string' || !ext?.trim?.()) {
        message = '값이 올바르지 않습니다.'
        return { result: false, message }
      }
      
      const maxCustomExtLength = (await getConfig()).maxCustomExtLength
      if (ext.length > maxCustomExtLength) {
        message = '값이 너무 깁니다.'
        return { result: false, message }
      }

      const fixedExtList = await getFixedExtList()
      const customExtList = await getCustomExtList()
      if (fixedExtList.includes(ext) || customExtList.includes(ext)) {
        message = '이미 존재하는 값입니다.'
        return { result: false, message }
      }
      return { result: true }
    } catch (err) {
      console.error(err)
      return { result: false, message: err.message, error: err }
    }
  }
  /**
   * 확장자가 유효한 값인지 확인(클라이언트에서 사용)
   * @param ext {string}
   * @param p {object}
   * @param p.maxCustomExtLength {number}
   * @param p.fixedExtList {string[]}
   * @param p.customExtList {string[]}
   * @returns o {object}
   * @returns o.result {boolean}
   * @returns o.message {string | undefined}
   */
  function isValidExtInClient(ext, { maxCustomExtLength, fixedExtList, customExtList }) {
    let message = undefined
    if (!ext || typeof ext !== 'string' || !ext?.trim?.()) {
      message = '값이 올바르지 않습니다.'
      return { result: false, message }
    }
    
    if (ext.length > maxCustomExtLength) {
      message = '값이 너무 깁니다.'
      return { result: false, message }
    }

    if (fixedExtList.includes(ext) || customExtList.includes(ext)) {
      message = '이미 존재하는 값입니다.'
      return { result: false, message }
    }
    return { result: true }
  }

  /* dao */
  /**
   * 고정 확장자 리스트 데이터 저장
   * @param fixedExtList {string[]} 고정 확장자 목록
   */
  async function updateFixedExtList(fixedExtList) {
    await localforage.setItem('fixedExtList', fixedExtList.map((ext) => getParsedExt(ext)))
  }
  /**
   * 커스텀 확장자 리스트 데이터 저장
   * @param customExtList {string[]} 고정 확장자 목록
   */
  async function updateCustomExtList(customExtList) {
    await localforage.setItem('customExtList', customExtList.map((ext) => getParsedExt(ext)))
  }

  /* init */
  const resetConfig = async () => {
    const config = {
      /* init value */
      // 확장자 최대 길이
      maxCustomExtLength: 20,
      // 최대 커스텀 확장자 리스트 수
      maxCustomExtListCount: 200,
    }
    await localforage.setItem('config', config)
    return config
  }
  const resetAllFixedExtList = async () => {
    const allFixedExtList = [
      /* init value */
      'bat',
      'cmd',
      'com', 
      'cpl',
      'exe',
      'scr',
      'js',
    ]
    await localforage.setItem('allFixedExtList', allFixedExtList)
    return allFixedExtList
  }
  const resetFixedExtList = async () => {
    const fixedExtList = [
      /* init value */
    ]
    await localforage.setItem('fixedExtList', fixedExtList)
    return fixedExtList
  }
  const resetCustomExtList = async () => {
    const customExtList = [
      /* init value */
      'sh',
      'ju',
      'ch',
    ]
    await localforage.setItem('customExtList', customExtList)
    return customExtList
  }
  /**
   * 데이터를 초기화
   */
  function init() {
    return Promise.all([
      resetConfig(),
      resetAllFixedExtList(),
      resetFixedExtList(),
      resetCustomExtList(),
    ])
  }

  /* service */
  /**
   * 설정 정보를 조회
   */
  async function getConfig() {
    let config = await localforage.getItem('config')
    if (!config || typeof config !== 'object') {
      config = await resetConfig()
    }
    return config
  }
  /**
   * 선택 가능한 고정 확장자 전체 목록을 조회
   */
  async function getAllFixedExtList() {
    let allFixedExtList = await localforage.getItem('allFixedExtList')
    if (!Array.isArray(allFixedExtList)) {
      allFixedExtList = await resetAllFixedExtList()
    }
    return allFixedExtList
  }
  /**
   * 고정 확장자 목록을 조회
   */
  async function getFixedExtList() {
    let fixedExtList = await localforage.getItem('fixedExtList')
    if (!Array.isArray(fixedExtList)) {
      fixedExtList = await resetFixedExtList()
    }
    return fixedExtList
  }
  /**
   * 커스텀 확장자 목록을 조회
   */
  async function getCustomExtList() {
    let customExtList = await localforage.getItem('customExtList')
    if (!Array.isArray(customExtList)) {
      customExtList = await resetCustomExtList()
    }
    return customExtList
  }
  /**
   * 고정 확장자 값을 목록에 추가
   * @param {string} ext 확장자 
   * @returns 확장자 값
   */
  async function insertFixedExt(ext) {
    const valid = await isValidExt(ext)
    if (!valid.result) {
      throw new Error(valid.message)
    }
    const oldList = await getFixedExtList()
    const newList = oldList.concat(ext)
      .filter((curExt, i, a) => a.indexOf(curExt) === i) /* uniq() */
      .sort()
    await updateFixedExtList(newList)
    return ext
  }
  /**
   * 커스텀 확장자 값을 목록에 추가
   * @param {string} ext 확장자 
   * @returns 확장자 값
   */
  async function insertCustomExt(ext) {
    const valid = await isValidExt(ext)
    if (!valid.result) {
      throw new Error(valid.message)
    }
    const oldList = await getCustomExtList()
    const newList = oldList.concat(ext)
      .filter((curExt, i, a) => a.indexOf(curExt) === i) /* uniq() */
    
    await updateCustomExtList(newList)
    return ext
  }
  /**
   * 고정 확장자 값을 목록에서 삭제
   * @param {string} ext 확장자 
   * @returns 확장자 값
   */
  async function removeFixedExt(ext) {
    const oldList = await getFixedExtList()
    const newList = oldList
      .filter(curExt => curExt !== ext)
      .filter((curExt, i, a) => a.indexOf(curExt) === i) /* uniq() */
      .sort()
    
    await updateFixedExtList(newList)
    return ext
  }
  /**
   * 커스텀 확장자 값을 목록에서 삭제
   * @param {string} ext 확장자 
   * @returns 확장자 값
   */
  async function removeCustomExt(ext) {
    const oldList = await getCustomExtList()
    const newList = oldList.concat(ext)
      .filter(curExt => curExt !== ext)
      .filter((curExt, i, a) => a.indexOf(curExt) === i) /* uniq() */
    
    await updateCustomExtList(newList)
    return ext
  }
  
  /* module 형태로 export */
  Object.assign(exports, {
    getParsedExt,
    isValidExtInClient,
    init,
    getConfig,
    getAllFixedExtList,
    getFixedExtList,
    getCustomExtList,
    insertFixedExt,
    insertCustomExt,
    removeFixedExt,
    removeCustomExt,
  })
})))