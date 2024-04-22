<template>
  <div>
    <div class="token-dropdown form-button-mobile">
      <div>
        <button type="button" class="btn btn-outline-success dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
          {{ getSelectedMethodName }}
        </button>

        <ul class="dropdown-menu">
          <li v-for="(method, mIdx) in methods" v-bind:key="method.name" class="flex flex-col gap-2">
            <span class="dropdown-item text-uppercase" @click="selectProposalMethod(mIdx)">
              <button type="button" class="btn btn-outline-success dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                {{ mIdx }} - {{method.name}}
              </button>
            </span>
          </li>
        </ul>


        
      </div>
    </div>

    <div v-for="(input, iIdx) in entry.value" class="flex flex-col gap-2">
      <!--------- <textarea v-model="fundMetadata[key]" class="form-control deposit-input" placeholder="key"></textarea> -------->

      <div>
        <h3> {{ input.name }} ({{ input.internalType }}) </h3>
      </div>
      <div v-if="entry.value[iIdx].isArray">
        <button type="button" class="btn btn-outline-success" @click="addInputField(iIdx)">
          Add Field
        </button>
        <div v-for="(subinput, siIdx) in input.data">
          <input v-model="input.data[siIdx]" class="form-control deposit-input"> 
        </div>
      </div>
      <div v-else>
        <input v-model="input.data" class="form-control deposit-input">
      </div>
    </div>
  </div>
</template>

<script>

/*

"inputs": [
      {
        "internalType": "address",
        "name": "module",
        "type": "address"
      },
      {
        "internalType": "uint16[]",
        "name": "_roles",
        "type": "uint16[]"
      },
      {
        "internalType": "bool[]",
        "name": "memberOf",
        "type": "bool[]"
      }
    ],

*/

export default {
  name: "ProposalEntry",
  props: ["methods", "entry"],

  data() {
    return {
      selectedMethodName: "-----------",
      selectedMethodInputs: [],
      selectedMethedImputData: [],
      inputIdx: 0,
      selectedMethodIdx: 0,
    }
  },

  components: { 
  },

  computed: {
    getSelectedMethodName() {
      if (this.entry.valueMethodIdx !== null) {
        return this.methods[this.entry.valueMethodIdx].name;
      } else {
        return this.selectedMethodName;
      }
    },
  },

  methods: {
    addInputField(fieldIdx) {
      this.entry.value[fieldIdx]["data"].push(null);
    },
    selectProposalMethod(methodIdx) {
      this.selectedMethodIdx = methodIdx;
      this.selectedMethodName = this.methods[methodIdx].name;
      this.selectedMethodInputs = this.methods[methodIdx].inputs;

      this.addSelectedMethedImputDataItem();
    },

    addSelectedMethedImputDataItem() {
      this.entry.value = [];
      this.inputIdx = 0;
      this.entry.valueMethodIdx = this.selectedMethodIdx;
      for (var iidx in this.methods[this.selectedMethodIdx].inputs) {
        let inputEntry = {
          idx: this.inputIdx++,
          isArray: false
        };
        //is array
        if (this.methods[this.selectedMethodIdx].inputs[iidx].internalType.endsWith("[]")) {
          inputEntry["data"] = [null];
          inputEntry["isArray"] = true;
        } else {
          //is not array
          inputEntry["data"] = null;
        }

        inputEntry["internalType"] = this.methods[this.selectedMethodIdx].inputs[iidx].internalType;   
        inputEntry["name"] = this.methods[this.selectedMethodIdx].inputs[iidx].name;   

        this.entry.value.push(inputEntry);
      }
    },  
  },
}
</script>

<style>

</style>
